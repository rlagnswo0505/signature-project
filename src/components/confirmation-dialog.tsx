import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Question {
  question: string;
  correctAnswer: boolean;
  errorMessage: string;
}

interface ConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const questions: Question[] = [
  {
    question: 'သင်ကိုယ်တိုင် လက်မှတ်ထိုးခဲ့ပါသလား?',
    correctAnswer: true,
    errorMessage: 'သင်ကိုယ်တိုင် လက်မှတ်ထိုးရပါမည်။',
  },
  {
    question: 'သင့်နေအိမ်က 부평구 광장로 16 1층 10호 미얀골 မှန်ပါသလား?',
    correctAnswer: true,
    errorMessage: 'လိပ်စာ မကိုက်ညီပါ။',
  },
  {
    question: 'လက်ဆောင် ရရှိဖူးပါသလား?',
    correctAnswer: false,
    errorMessage: 'လက်ဆောင်ရရှိပါက ဆက်လုပ်ဆောင်၍မရပါ။',
  },
  {
    question: 'ငွေပေးချေမည့်ရက်က ၁၃ ရက်မှန်ပါသလား?',
    correctAnswer: true,
    errorMessage: 'ငွေပေးချေမည့်ရက် မကိုက်ညီပါ။',
  },
];

export function ConfirmationDialog({ open, onConfirm, onCancel }: ConfirmationDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null, null]);
  const [error, setError] = useState<string>('');

  const currentQuestion = questions[currentStep];
  const correctAnswer = currentQuestion.correctAnswer;

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = answer;
    setAnswers(newAnswers);

    if (answer !== correctAnswer) {
      setError(currentQuestion.errorMessage);
      return;
    }

    setError('');

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 모든 질문에 정답
      onConfirm();
      resetDialog();
    }
  };

  const resetDialog = () => {
    setCurrentStep(0);
    setAnswers([null, null, null, null]);
    setError('');
  };

  const handleCancel = () => {
    resetDialog();
    onCancel();
  };

  const renderQuestion = () => {
    const parts = currentQuestion.question.split(/(\d+|미얀골|부평구 광장로 16 1층 10호|13일)/g);

    return parts.map((part, index) => {
      if (/\d+|미얀골|부평구 광장로 16 1층 10호|13일/.test(part)) {
        return (
          <span key={index} className="font-bold text-blue-600">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">လက်မှတ် အတည်ပြုခြင်း ({currentStep + 1}/4)</DialogTitle>
          <DialogDescription className="text-base pt-2">{renderQuestion()}</DialogDescription>
        </DialogHeader>

        {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">{error}</div>}

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button type="button" variant={'outline'} onClick={() => handleAnswer(true)} className={correctAnswer ? 'font-bold border-2 border-blue-600' : 'border-2'}>
            Yes
          </Button>
          <Button type="button" variant={'outline'} onClick={() => handleAnswer(false)} className={!correctAnswer ? 'font-bold border-2 border-blue-600' : 'border-2'}>
            No
          </Button>
        </DialogFooter>

        <div className="flex justify-center gap-2 mt-2">
          {questions.map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full ${index === currentStep ? 'bg-blue-600' : index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
