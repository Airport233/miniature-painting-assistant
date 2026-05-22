import React, { useRef, useState } from 'react';

interface PhotoColorPickerProps {
  onColorPicked: (r: number, g: number, b: number) => void;
}

export default function PhotoColorPicker({ onColorPicked }: PhotoColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxWidth = 300;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImageLoaded(true);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    onColorPicked(pixel[0], pixel[1], pixel[2]);
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      marginTop: '12px',
    },
    fileInput: {
      color: '#dbdee1',
      fontSize: '13px',
      marginBottom: '8px',
    },
    canvas: {
      maxWidth: '300px',
      cursor: imageLoaded ? 'crosshair' : 'default',
      borderRadius: '4px',
      border: imageLoaded ? '1px solid #4e5058' : 'none',
      display: 'block',
    },
    instruction: {
      color: '#b5bac1',
      fontSize: '12px',
      marginTop: '6px',
    },
  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        style={styles.fileInput}
      />
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={styles.canvas}
      />
      {imageLoaded && (
        <p style={styles.instruction}>
          点击图片取色
        </p>
      )}
    </div>
  );
}
