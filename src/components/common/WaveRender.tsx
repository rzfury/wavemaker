import { useEffect, useRef } from 'react';

export default function WaveRender(props: { samples: number[] }) {
  const samples = props.samples || [];

  const CANVAS_RESOLUTION = 2;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {

      const { width, height } = canvas.getBoundingClientRect();
      const centerY = height / 2 * CANVAS_RESOLUTION;
      const strokeWidth = 2 * CANVAS_RESOLUTION;

      canvas.width = width * CANVAS_RESOLUTION;
      canvas.height = height * CANVAS_RESOLUTION;

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#121613';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.beginPath();

      if (samples.length === 0) {
        context.moveTo(0, centerY);
        context.lineTo(canvas.width * CANVAS_RESOLUTION, centerY);
      }
      else {
        context.beginPath();
        context.moveTo(0, centerY - (samples[0] * centerY * 0.98));
  
        for (let i = 0; i < samples.length; i++) {
          const x = (i / (samples.length - 1)) * canvas.width;
          const y = (centerY - (samples[i] * centerY * 0.98));
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = "lime";
      context.lineWidth = strokeWidth;
      context.stroke();
    }
  }

  useEffect(() => {
    render();
  }, [render, samples]);

  return (
    <canvas ref={canvasRef} className="w-full h-full"/>
  );
}
