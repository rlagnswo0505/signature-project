import { useRef, useState } from 'react';
import { SignatureCanvas } from './signature-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TabletMockupProps {
  signatures: {
    signer1: boolean;
    signer2: boolean;
  };
  onSignatureChange: (key: string, value: boolean) => void;
  onCapture: (element: HTMLDivElement) => void;
  isAllSigned: boolean;
}

export function TabletMockup({ signatures, onSignatureChange, onCapture, isAllSigned }: TabletMockupProps) {
  const mockupRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState({
    question1: null as boolean | null,
    question2: null as boolean | null,
    question3: null as boolean | null,
    question4: null as boolean | null,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 영어 대문자만 허용
    const value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, '');
    setName(value);
  };

  const handleAnswerChange = (question: string, answer: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const handleCapture = () => {
    // 질문 검증
    if (answers.question1 !== true) {
      alert('❌ သင်ကိုယ်တိုင် တက်ဘလက်ဖြင့် ရေးသားပြီး လက်မှတ်ထိုးရပါမည်။');
      return;
    }
    if (answers.question2 !== false) {
      alert('❌ လက်ဆောင် ရရှိပါက ကတ်ထုတ်ပေးခြင်းမပြုပါ။');
      return;
    }
    if (answers.question3 !== true) {
      alert('❌ လိပ်စာကိုကြည့်ပါ။');
      return;
    }
    if (answers.question4 !== true) {
      alert('❌ ငွေပေးချေမည့်ရက်သည် ၁၃ ရက်မှန်ကန်ပါသလား ကြည့်ပါ။');
      return;
    }

    // 모든 검증 통과 시 캡처
    if (mockupRef.current) {
      onCapture(mockupRef.current);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', padding: '1rem' }}>
      {/* 타이틀 */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>တက်ဘလက် လက်မှတ်ထိုးခြင်း</h1>
        <p style={{ color: '#f86565' }}>ကိုယ်တိုင်လျှောက်ထား၊ ကိုယ်တိုင်လက်မှတ်ထိုး</p>
      </div>

      {/* 메인 컨테이너 - 태블릿 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', marginBottom: '2rem' }}>
        {/* 태블릿 목업 */}
        <div ref={mockupRef} style={{ position: 'relative' }}>
          {/* 외부 프레임 - 세로 방향 */}
          <div
            style={{
              background: 'linear-gradient(to bottom right, #111827, #1f2937, #111827)',
              borderRadius: '1.5rem',
              width: '360px',
              height: '600px',
              padding: '12px',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* 베젤 (검은색 테두리) */}
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#000000',
                borderRadius: '1rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* 상단 스피커/센서 영역 */}
              <div style={{ height: '1.5rem', background: 'linear-gradient(to bottom, #111827, #000000)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #374151' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} style={{ width: '0.25rem', height: '0.125rem', backgroundColor: '#4b5563', borderRadius: '9999px' }}></div>
                  ))}
                </div>
              </div>

              {/* 화면 영역 */}
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'linear-gradient(to bottom, #ffffff, #f9fafb)' }}>
                {/* 헤더 */}
                <div style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>လက်မှတ်စာရွက်စာတမ်း</h2>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#4b5563' }}>နေရာ 2 ခုလုံးတွင် လက်မှတ်ထိုးပါ</p>
                </div>

                {/* 서명 영역 - 세로 스택 */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* 이름 입력 필드 */}
                  <div className="flex flex-col gap-2 p-3 border-2 border-gray-400 rounded-lg bg-blue-50">
                    <Label htmlFor="name" className="text-xs font-bold">
                      သင့်အမည် (အင်္ဂလိပ်စာလုံးကြီး)
                    </Label>
                    <Input id="name" type="text" value={name} onChange={handleNameChange} placeholder="NAME" className="text-sm font-semibold uppercase" />
                  </div>

                  {/* 이름 입력 후에만 질문과 서명란 표시 */}
                  {name.trim() && (
                    <>
                      {/* 고객 확인 질문 */}
                      <div className="flex flex-col gap-3 p-3 border-2 border-orange-400 rounded-lg bg-yellow-50">
                        <div className="text-xs font-bold text-red-600 leading-relaxed">
                          အရာအားလုံးကို ဖတ်ပြီး တက်ဘလက်တွင် လက်မှတ်ထိုးပါ။
                          <br />
                          မေးခွန်းများကို မှားယွင်းစွာ ဖြေဆိုပါက ကတ်ထုတ်ပေးမှု ပယ်ဖျက်ခံရနိုင်ပါသည်။
                        </div>

                        {/* 질문 1 */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs font-semibold">၁။ သင်ကိုယ်တိုင် တက်ဘလက်ဖြင့် ရေးသားပြီး လက်မှတ်ထိုးခဲ့ပါသလား?</Label>
                          <div className="flex gap-2">
                            <Button size="sm" variant={answers.question1 === true ? 'default' : 'outline'} onClick={() => handleAnswerChange('question1', true)} className="text-xs flex-1">
                              Yes ✓
                            </Button>
                            <Button size="sm" variant={answers.question1 === false ? 'default' : 'outline'} onClick={() => handleAnswerChange('question1', false)} className="text-xs flex-1">
                              No
                            </Button>
                          </div>
                        </div>

                        {/* 질문 2 */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs font-semibold">၂။ လက်ဆောင် ရရှိဖူးပါသလား?</Label>
                          <div className="flex gap-2">
                            <Button size="sm" variant={answers.question2 === true ? 'default' : 'outline'} onClick={() => handleAnswerChange('question2', true)} className="text-xs flex-1">
                              Yes
                            </Button>
                            <Button size="sm" variant={answers.question2 === false ? 'default' : 'outline'} onClick={() => handleAnswerChange('question2', false)} className="text-xs flex-1">
                              No ✓
                            </Button>
                          </div>
                        </div>

                        {/* 질문 3 */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs font-semibold">၃။ သင့်နေအိမ်လိပ်စာက 부평구 광장로 16 1층 10호 미얀골 မှန်ပါသလား?</Label>
                          <div className="flex gap-2">
                            <Button size="sm" variant={answers.question3 === true ? 'default' : 'outline'} onClick={() => handleAnswerChange('question3', true)} className="text-xs flex-1">
                              Yes ✓
                            </Button>
                            <Button size="sm" variant={answers.question3 === false ? 'default' : 'outline'} onClick={() => handleAnswerChange('question3', false)} className="text-xs flex-1">
                              No
                            </Button>
                          </div>
                        </div>

                        {/* 질문 4 */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs font-semibold">၄။ ငွေပေးချေမည့်ရက်သည် ၁၃ ရက်မှန်ပါသလား?</Label>
                          <div className="flex gap-2">
                            <Button size="sm" variant={answers.question4 === true ? 'default' : 'outline'} onClick={() => handleAnswerChange('question4', true)} className="text-xs flex-1">
                              Yes (13th) ✓
                            </Button>
                            <Button size="sm" variant={answers.question4 === false ? 'default' : 'outline'} onClick={() => handleAnswerChange('question4', false)} className="text-xs flex-1">
                              No
                            </Button>
                          </div>
                        </div>
                      </div>

                      <SignatureCanvas label="လက်မှတ် ၁" onSignatureChange={(val) => onSignatureChange('signer1', val)} name={name} />
                      <SignatureCanvas label="လက်မှတ် ၂" onSignatureChange={(val) => onSignatureChange('signer2', val)} name={name} />
                    </>
                  )}
                </div>

                {/* 푸터 */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>{new Date().toLocaleDateString('ko-KR')}</p>
                  <Button onClick={handleCapture} disabled={!isAllSigned} size="sm" className="text-xs">
                    📸 ဓာတ်ပုံရိုက်မည်
                  </Button>
                </div>
              </div>

              {/* 하단 홈 버튼 */}
              <div style={{ height: '1.75rem', background: 'linear-gradient(to top, #111827, #000000)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #374151' }}>
                <div
                  style={{
                    width: '3rem',
                    height: '0.375rem',
                    backgroundColor: '#1f2937',
                    borderRadius: '9999px',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8)',
                  }}
                ></div>
              </div>
            </div>

            {/* 사이드 버튼 */}
            <div style={{ position: 'absolute', right: '0', top: '6rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginRight: '-0.25rem' }}>
              <div
                style={{
                  width: '0.25rem',
                  height: '2rem',
                  backgroundColor: '#374151',
                  borderTopLeftRadius: '0.125rem',
                  borderBottomLeftRadius: '0.125rem',
                  boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.1)',
                }}
              ></div>
              <div
                style={{
                  width: '0.25rem',
                  height: '2rem',
                  backgroundColor: '#374151',
                  borderTopLeftRadius: '0.125rem',
                  borderBottomLeftRadius: '0.125rem',
                  boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.1)',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 표시 */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{signatures.signer1 && signatures.signer2 ? '✅ လက်မှတ်အားလုံး ပြီးစီးပါပြီ!' : `⏳ ${[signatures.signer1, signatures.signer2].filter(Boolean).length}/2 ပြီးစီး`}</p>
      </div>
    </div>
  );
}
