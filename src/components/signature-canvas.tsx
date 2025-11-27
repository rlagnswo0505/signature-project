import type React from 'react';
import { useRef, useEffect, useState } from 'react';

interface SignatureCanvasProps {
  label: string;
  onSignatureChange: (isSigned: boolean) => void;
}

export function SignatureCanvas({ label, onSignatureChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 배경색 설정
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Placeholder 텍스트 그리기
    if (!isSigned) {
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('전자서명', canvas.width / 2, canvas.height / 2);
    }

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isSigned]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // placeholder 지우기
    if (!isSigned) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();

    const pos = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    ctx.beginPath();
    ctx.moveTo(pos.clientX - rect.left, pos.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    ctx.lineTo(pos.clientX - rect.left, pos.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let hasSomething = false;

    for (let i = 0; i < data.length; i += 4) {
      // 배경색(흰색)이 아닌 픽셀이 있는지 확인
      if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) {
        hasSomething = true;
        break;
      }
    }

    if (hasSomething && !isSigned) {
      setIsSigned(true);
      onSignatureChange(true);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
    onSignatureChange(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold" style={{ color: '#1f2937' }}>
          {label}
        </label>
        {isSigned && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
            완료
          </span>
        )}
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-20 rounded-lg cursor-crosshair touch-none transition-colors"
        style={{
          touchAction: 'none',
          border: '2px solid #d1d5db',
          backgroundColor: '#ffffff',
        }}
      />
      {isSigned && (
        <button onClick={clearSignature} className="text-xs underline text-left" style={{ color: '#dc2626' }}>
          삭제
        </button>
      )}
    </div>
  );
}
