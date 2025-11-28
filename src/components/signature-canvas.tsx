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

    // 이름이 있으면 항상 표시 (서명 후에도 유지)
    if (name) {
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
    } else {
      // 이름이 없을 때만 "전자서명" placeholder
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('전자서명', canvas.width / 2, canvas.height / 2);
    }

    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [name]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 첫 그리기 시작할 때만 "전자서명" placeholder 지우기 (이름은 유지)
    if (!hasStartedDrawing && !name) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasStartedDrawing(true);
    } else if (!hasStartedDrawing && name) {
      // 이름이 있을 때는 배경만 다시 그리고 이름 유지
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
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

    // 실제로 그린 선이 있는지 확인 (검은색 선만 카운트)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let hasDrawing = false;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // 검은색에 가까운 픽셀만 체크 (실제 그린 선)
      // placeholder 회색(#d1d5db = rgb(209, 213, 219))은 제외
      if (r < 100 && g < 100 && b < 100) {
        hasDrawing = true;
        break;
      }
    }

    if (hasDrawing && !isSigned) {
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

    // 이름이 있으면 이름 표시, 없으면 "전자서명" 표시
    if (name) {
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
    } else {
      ctx.fillStyle = '#d1d5db';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('전자서명', canvas.width / 2, canvas.height / 2);
    }

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
        className="w-full h-40 rounded-lg cursor-crosshair touch-none transition-colors border-[2px]"
        style={{
          touchAction: 'none',
          borderColor: '#9ca3af',
          backgroundColor: '#ffffff',
        }}
      />
      {isSigned && (
        <Button variant="destructive" size="sm" onClick={clearSignature} className="text-xs">
          삭제
        </Button>
      )}
    </div>
  );
}
