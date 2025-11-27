import { useRef } from 'react';
import { SignatureCanvas } from './signature-canvas';

interface TabletMockupProps {
  signatures: {
    signer1: boolean;
    signer2: boolean;
    signer3: boolean;
  };
  onSignatureChange: (key: string, value: boolean) => void;
  onCapture: (element: HTMLDivElement) => void;
  isAllSigned: boolean;
}

export function TabletMockup({ signatures, onSignatureChange, onCapture, isAllSigned }: TabletMockupProps) {
  const mockupRef = useRef<HTMLDivElement>(null);

  const handleCapture = () => {
    if (mockupRef.current) {
      onCapture(mockupRef.current);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', padding: '1rem' }}>
      {/* 타이틀 */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>서명 시스템</h1>
        <p style={{ color: '#cbd5e1' }}>태블릿에 3개의 서명을 완료하세요</p>
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
                <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>서명 문서</h2>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#4b5563' }}>3개 필드에 모두 서명하세요</p>
                </div>

                {/* 서명 영역 - 세로 스택 */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <SignatureCanvas label="전자서명 1" onSignatureChange={(val) => onSignatureChange('signer1', val)} />
                  <SignatureCanvas label="전자서명 2" onSignatureChange={(val) => onSignatureChange('signer2', val)} />
                  <SignatureCanvas label="전자서명 3" onSignatureChange={(val) => onSignatureChange('signer3', val)} />
                </div>

                {/* 푸터 */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>{new Date().toLocaleDateString('ko-KR')}</p>
                  <button
                    onClick={handleCapture}
                    disabled={!isAllSigned}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      border: 'none',
                      ...(isAllSigned
                        ? {
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                          }
                        : {
                            backgroundColor: '#d1d5db',
                            color: '#6b7280',
                            cursor: 'not-allowed',
                            opacity: '0.5',
                          }),
                    }}
                  >
                    📸 캡처
                  </button>
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
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{signatures.signer1 && signatures.signer2 && signatures.signer3 ? '✅ 모든 서명이 완료되었습니다!' : `⏳ ${[signatures.signer1, signatures.signer2, signatures.signer3].filter(Boolean).length}/3 완료`}</p>
      </div>
    </div>
  );
}
