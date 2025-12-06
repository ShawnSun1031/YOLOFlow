import React, { useRef, useEffect } from 'react';
import { Box } from '@mantine/core';

export function ImageCanvas({ src, boxes = [], showBoxes = true }) {
    const canvasRef = useRef(null);
    const imgRef = useRef(new Image());

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        imgRef.current.src = src;
        imgRef.current.onload = () => {
            canvas.width = imgRef.current.width;
            canvas.height = imgRef.current.height;
            draw(ctx, canvas.width, canvas.height);
        };
    }, [src]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Redraw when toggles change or boxes change
        if (imgRef.current.complete) {
            draw(ctx, canvas.width, canvas.height);
        }
    }, [boxes, showBoxes]);

    const draw = (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(imgRef.current, 0, 0, w, h);

        if (showBoxes) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.font = '20px Arial';
            ctx.fillStyle = 'red';

            boxes.forEach(box => {
                // Assuming YOLO format: [class_index, x_center, y_center, width, height] (normalized 0-1)
                // Or [x, y, w, h] depending on standard. Let's assume standardized YOLO (xywh normalized) for now
                // But for mock data ease, let's just do x, y, w, h absolute or normalized?
                // Let's assume normalized XYWH (center x, center y, width, height)

                // However, standard simplified mock might just be x, y, w, h pixels or ratios.
                // Let's assume the mock data sends "normalized xc, yc, w, h"

                const [cls, xc, yc, bw, bh] = box;

                const x = (xc - bw / 2) * w;
                const y = (yc - bh / 2) * h;
                const width = bw * w;
                const height = bh * h;

                ctx.strokeRect(x, y, width, height);
                ctx.fillText(`Class ${cls}`, x, y > 25 ? y - 5 : y + 20);
            });
        }
    };

    return (
        <Box style={{ maxWidth: '100%', overflow: 'auto' }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', border: '1px solid #eee' }} />
        </Box>
    );
}
