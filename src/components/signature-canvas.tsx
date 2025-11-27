import type React from 'react';
import { useRef, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SignatureCanvasProps {
  label: string;
  onSignatureChange: (isSigned: boolean) => void;
  name?: string;
}

export function SignatureCanvas({ label, onSignatureChange, name }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);

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

    // Placeholder 텍스트 그리기 (이름이 있으면 이름, 없으면 "전자서명")
    const displayText = name || '전자서명';
    ctx.fillStyle = '#d1d5db';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [name]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 처음 그리기 시작할 때만 배경 지우고 이름 placeholder 다시 그리기
    if (!hasStartedDrawing) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (name) {
        ctx.fillStyle = '#d1d5db';
        ctx.font = 'bold 30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, canvas.width / 2, canvas.height / 2);
      }

      setHasStartedDrawing(true);
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

    // Placeholder 다시 표시
    const displayText = name || '전자서명';
    ctx.fillStyle = '#d1d5db';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, canvas.width / 2, canvas.height / 2);

    setIsSigned(false);
    setHasStartedDrawing(false);
    onSignatureChange(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        {isSigned && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            완료
          </Badge>
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
        className="w-full h-20 rounded-lg cursor-crosshair touch-none transition-colors border-2"
        style={{
          touchAction: 'none',
          borderColor: '#d1d5db',
          backgroundColor: '#ffffff',
        }}
      />
      {isSigned && (
        <Button variant="link" onClick={clearSignature} className="text-xs h-auto p-0 text-red-600 hover:text-red-700 justify-start">
          삭제
        </Button>
      )}
    </div>
  );
}
