import { useState } from 'react';
import html2canvas from 'html2canvas';
import { TabletMockup } from './components/tablet-mockup';

function App() {
  const [signatures, setSignatures] = useState({
    signer1: false,
    signer2: false,
    signer3: false,
  });

  const isAllSigned = signatures.signer1 && signatures.signer2 && signatures.signer3;

  const handleSignatureChange = (key: string, value: boolean) => {
    setSignatures((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCapture = async (element: HTMLDivElement) => {
    // 확인 알림창
    const confirmed = window.confirm('본인이 직접 신청하고 전자서명 하셨나요?');
    
    if (!confirmed) {
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
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

  return (
    <main className="min-h-screen bg-background">
      <TabletMockup signatures={signatures} onSignatureChange={handleSignatureChange} onCapture={handleCapture} isAllSigned={isAllSigned} />
    </main>
  );
}

export default App;
