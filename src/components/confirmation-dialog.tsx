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
    question: '본인이 서명하셨나요?',
    correctAnswer: true,
    errorMessage: '본인이 직접 서명해야 합니다.',
  },
  {
    question: '자택이 부평구 광장로 16 1층 10호 미얀골이 맞나요?',
    correctAnswer: true,
    errorMessage: '주소가 일치하지 않습니다.',
  },
  {
    question: '선물받은거 있나요?',
    correctAnswer: false,
    errorMessage: '선물을 받으셨다면 진행할 수 없습니다.',
  },
  {
    question: '결제일자가 13일인가요?',
    correctAnswer: true,
    errorMessage: '결제일자가 일치하지 않습니다.',
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
          <DialogTitle className="text-xl">서명 확인 ({currentStep + 1}/4)</DialogTitle>
          <DialogDescription className="text-base pt-2">{renderQuestion()}</DialogDescription>
        </DialogHeader>

        {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">{error}</div>}

        <DialogFooter className="flex gap-3 sm:gap-3">
          <Button type="button" variant={correctAnswer ? 'default' : 'outline'} onClick={() => handleAnswer(true)} className={correctAnswer ? 'font-bold' : ''}>
            예
          </Button>
          <Button type="button" variant={!correctAnswer ? 'default' : 'outline'} onClick={() => handleAnswer(false)} className={!correctAnswer ? 'font-bold' : ''}>
            아니요
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
