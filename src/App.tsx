import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { TabletMockup } from './components/tablet-mockup';
import { ConfirmationDialog } from './components/confirmation-dialog';

function App() {
  const [signatures, setSignatures] = useState({
    signer1: false,
    signer2: false,
    signer3: false,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const captureElementRef = useRef<HTMLDivElement | null>(null);

  const isAllSigned = signatures.signer1 && signatures.signer2 && signatures.signer3;

  const handleSignatureChange = (key: string, value: boolean) => {
    setSignatures((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCaptureRequest = (element: HTMLDivElement) => {
    captureElementRef.current = element;
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setDialogOpen(false);

    if (!captureElementRef.current) return;

    try {
      const canvas = await html2canvas(captureElementRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          // oklch를 사용하는 요소 무시
          const computedStyle = window.getComputedStyle(element);
          return computedStyle.color?.includes('oklch') || computedStyle.backgroundColor?.includes('oklch');
        },
        onclone: (clonedDoc) => {
          // 클론된 문서에서 oklch 색상을 rgb로 변환
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const computedStyle = window.getComputedStyle(el);
            
            // oklch를 사용하는 경우 fallback 색상 설정
            if (computedStyle.color?.includes('oklch')) {
              htmlEl.style.color = '#1a1a1a';
            }
            if (computedStyle.backgroundColor?.includes('oklch')) {
              htmlEl.style.backgroundColor = '#ffffff';
            }
            if (computedStyle.borderColor?.includes('oklch')) {
              htmlEl.style.borderColor = '#e0e0e0';
            }
          });
        },
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `signature-document-${new Date().getTime()}.png`;
      link.click();
    } catch (error) {
      console.error('캡처 중 오류가 발생했습니다:', error);
      alert('캡처에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <main className="min-h-screen bg-background">
        <TabletMockup signatures={signatures} onSignatureChange={handleSignatureChange} onCapture={handleCaptureRequest} isAllSigned={isAllSigned} />
      </main>
      <ConfirmationDialog open={dialogOpen} onConfirm={handleConfirm} onCancel={handleCancel} />
    </>
  );
}

export default App;
