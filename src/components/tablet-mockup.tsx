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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      {/* 타이틀 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">서명 시스템</h1>
        <p className="text-slate-300">태블릿에 3개의 서명을 완료하세요</p>
      </div>

      {/* 메인 컨테이너 - 태블릿 */}
      <div className="flex items-center justify-center gap-12 mb-8">
        {/* 태블릿 목업 */}
        <div ref={mockupRef} className="relative">
          {/* 외부 프레임 - 세로 방향 */}
          <div
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl"
            style={{
              width: '360px',
              height: '600px',
              padding: '12px',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* 베젤 (검은색 테두리) */}
            <div
              className="w-full h-full bg-black rounded-2xl overflow-hidden flex flex-col"
              style={{
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              {/* 상단 스피커/센서 영역 */}
              <div className="h-6 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center border-b border-gray-700">
                <div className="flex gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1 h-0.5 bg-gray-600 rounded-full"></div>
                  ))}
                </div>
              </div>

              {/* 화면 영역 */}
              <div className="flex-1 overflow-hidden flex flex-col" style={{ background: 'linear-gradient(to bottom, #ffffff, #f9fafb)' }}>
                {/* 헤더 */}
                <div className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <h2 className="text-xl font-bold" style={{ color: '#111827' }}>서명 문서</h2>
                  <p className="text-xs mt-1" style={{ color: '#4b5563' }}>3개 필드에 모두 서명하세요</p>
                </div>

                {/* 서명 영역 - 세로 스택 */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  <SignatureCanvas label="전자서명 1" onSignatureChange={(val) => onSignatureChange('signer1', val)} />
                  <SignatureCanvas label="전자서명 2" onSignatureChange={(val) => onSignatureChange('signer2', val)} />
                  <SignatureCanvas label="전자서명 3" onSignatureChange={(val) => onSignatureChange('signer3', val)} />
                </div>

                {/* 푸터 */}
                <div className="px-6 py-4 flex items-center justify-between gap-2" style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                  <p className="text-xs" style={{ color: '#4b5563' }}>{new Date().toLocaleDateString('ko-KR')}</p>
                  <button 
                    onClick={handleCapture} 
                    disabled={!isAllSigned} 
                    className="px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap"
                    style={isAllSigned ? {
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                    } : {
                      backgroundColor: '#d1d5db',
                      color: '#6b7280',
                      cursor: 'not-allowed',
                      opacity: '0.5'
                    }}
                  >
                    📸 캡처
                  </button>
                </div>
              </div>

              {/* 하단 홈 버튼 */}
              <div className="h-7 bg-gradient-to-t from-gray-900 to-black flex items-center justify-center border-t border-gray-700">
                <div
                  className="w-12 h-1.5 bg-gray-800 rounded-full"
                  style={{
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.8)',
                  }}
                ></div>
              </div>
            </div>

            {/* 사이드 버튼 */}
            <div className="absolute right-0 top-24 flex flex-col gap-4 -mr-1">
              <div
                className="w-1 h-8 bg-gray-700 rounded-l-sm"
                style={{
                  boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.1)',
                }}
              ></div>
              <div
                className="w-1 h-8 bg-gray-700 rounded-l-sm"
                style={{
                  boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.1)',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 상태 표시 */}
      <div className="text-center">
        <p className="text-sm text-slate-300">{signatures.signer1 && signatures.signer2 && signatures.signer3 ? '✅ 모든 서명이 완료되었습니다!' : `⏳ ${[signatures.signer1, signatures.signer2, signatures.signer3].filter(Boolean).length}/3 완료`}</p>
      </div>
    </div>
  );
}
