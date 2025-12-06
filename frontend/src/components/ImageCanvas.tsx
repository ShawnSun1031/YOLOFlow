import { useRef, useEffect, useCallback } from 'react';
import { Box } from '@mantine/core';

interface ImageCanvasProps {
    src: string;
    boxes?: number[][];
    showBoxes?: boolean;
}

export function ImageCanvas({ src, boxes = [], showBoxes = true }: ImageCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(new Image());

    const draw = useCallback(
        (ctx: CanvasRenderingContext2D, w: number, h: number) => {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(imgRef.current, 0, 0, w, h);

            if (showBoxes) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.font = '20px Arial';
                ctx.fillStyle = 'red';

                boxes.forEach((box) => {
                    const [cls, xc, yc, bw, bh] = box;

                    const x = (xc - bw / 2) * w;
                    const y = (yc - bh / 2) * h;
                    const width = bw * w;
                    const height = bh * h;

                    ctx.strokeRect(x, y, width, height);
                    ctx.fillText(`Class ${cls}`, x, y > 25 ? y - 5 : y + 20);
                });
            }
        },
        [boxes, showBoxes],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        imgRef.current.src = src;
        imgRef.current.onload = () => {
            canvas.width = imgRef.current.width;
            canvas.height = imgRef.current.height;
            draw(ctx, canvas.width, canvas.height);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Redraw when toggles change or boxes change
        if (imgRef.current.complete) {
            draw(ctx, canvas.width, canvas.height);
        }
    }, [draw]);

    return (
        <Box style={{ maxWidth: '100%', overflow: 'auto' }}>
            <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', height: 'auto', border: '1px solid #eee' }}
            />
        </Box>
    );
}
