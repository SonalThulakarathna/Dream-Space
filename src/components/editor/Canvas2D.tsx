import { useRef, useState, useEffect, useCallback } from 'react';
import { FurnitureItem } from '@/types/design';

interface Canvas2DProps {
  roomWidth: number;
  roomDepth: number;
  wallColor: string;
  floorColor: string;
  furniture: FurnitureItem[];
  selectedId: string | null;
  onSelectFurniture: (id: string | null) => void;
  onUpdateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
}

const SCALE = 80; // pixels per meter
const PADDING = 40;

export default function Canvas2D({
  roomWidth, roomDepth, wallColor, floorColor,
  furniture, selectedId, onSelectFurniture, onUpdateFurniture,
}: Canvas2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizing, setResizing] = useState<{ id: string; corner: string } | null>(null);

  const canvasW = roomWidth * SCALE + PADDING * 2;
  const canvasH = roomDepth * SCALE + PADDING * 2;

  const toCanvas = (meterX: number, meterY: number) => ({
    x: PADDING + meterX * SCALE,
    y: PADDING + meterY * SCALE,
  });

  const toMeters = (px: number, py: number) => ({
    x: (px - PADDING) / SCALE,
    y: (py - PADDING) / SCALE,
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasW;
    canvas.height = canvasH;

    // Floor (Dark mode – card surface)
    ctx.fillStyle = '#1a1e24';
    ctx.fillRect(PADDING, PADDING, roomWidth * SCALE, roomDepth * SCALE);

    // Grid (Subtle lines for alignment)
    ctx.strokeStyle = '#2a2e36';
    ctx.lineWidth = 1;
    for (let x = 0; x <= roomWidth; x++) {
      const px = PADDING + x * SCALE;
      ctx.beginPath(); ctx.moveTo(px, PADDING); ctx.lineTo(px, PADDING + roomDepth * SCALE); ctx.stroke();
    }
    for (let y = 0; y <= roomDepth; y++) {
      const py = PADDING + y * SCALE;
      ctx.beginPath(); ctx.moveTo(PADDING, py); ctx.lineTo(PADDING + roomWidth * SCALE, py); ctx.stroke();
    }

    // Walls (Foreground accent)
    ctx.strokeStyle = '#e4e6ea';
    ctx.lineWidth = 4;
    ctx.strokeRect(PADDING, PADDING, roomWidth * SCALE, roomDepth * SCALE);

    // Dimensions (Crisp typography)
    ctx.fillStyle = '#e4e6ea';
    ctx.font = '500 11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${roomWidth}m`, PADDING + (roomWidth * SCALE) / 2, PADDING - 10);
    ctx.save();
    ctx.translate(PADDING - 14, PADDING + (roomDepth * SCALE) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${roomDepth}m`, 0, 0);
    ctx.restore();

    // Furniture
    furniture.forEach((item) => {
      const pos = toCanvas(item.x, item.y);
      const w = item.width * SCALE;
      const d = item.depth * SCALE;

      ctx.save();
      ctx.translate(pos.x + w / 2, pos.y + d / 2);
      ctx.rotate((item.rotation * Math.PI) / 180);

      const isSelected = item.id === selectedId;

      // Shadow (Soft elevation for dark mode)
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Body (Dark surface with border)
      ctx.fillStyle = '#262b33';
      ctx.fillRect(-w / 2, -d / 2, w, d);
      
      // Reset shadow for borders/selection
      ctx.shadowColor = 'transparent';

      ctx.strokeStyle = isSelected ? '#e4e6ea' : '#4a5163';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(-w / 2, -d / 2, w, d);

      // Label
      ctx.fillStyle = isSelected ? '#e4e6ea' : '#7a8194';
      ctx.font = '10px "IBM Plex Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(-w/2 + 2, -d/2 + 2, w - 4, d - 4);
      ctx.clip();
      ctx.fillText(item.label || item.name || '', 0, 0);
      ctx.restore();

      // Selection controls
      if (isSelected) {
        ctx.fillStyle = '#e4e6ea';
        ctx.strokeStyle = '#13151a';
        ctx.lineWidth = 1.5;

        // Resize handles (Corners)
        const s = 6;
        ctx.fillRect(-w / 2 - s / 2, -d / 2 - s / 2, s, s);
        ctx.strokeRect(-w / 2 - s / 2, -d / 2 - s / 2, s, s);
        ctx.fillRect(w / 2 - s / 2, -d / 2 - s / 2, s, s);
        ctx.strokeRect(w / 2 - s / 2, -d / 2 - s / 2, s, s);
        ctx.fillRect(-w / 2 - s / 2, d / 2 - s / 2, s, s);
        ctx.strokeRect(-w / 2 - s / 2, d / 2 - s / 2, s, s);
        ctx.fillRect(w / 2 - s / 2, d / 2 - s / 2, s, s);
        ctx.strokeRect(w / 2 - s / 2, d / 2 - s / 2, s, s);
      }

      ctx.restore();
    });
  }, [roomWidth, roomDepth, wallColor, floorColor, furniture, selectedId, canvasW, canvasH]);

  useEffect(() => { draw(); }, [draw]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const findFurnitureAt = (px: number, py: number) => {
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const pos = toCanvas(item.x, item.y);
      const w = item.width * SCALE;
      const d = item.depth * SCALE;
      if (px >= pos.x && px <= pos.x + w && py >= pos.y && py <= pos.y + d) {
        return item;
      }
    }
    return null;
  };

  const isOnResizeHandle = (px: number, py: number, item: FurnitureItem) => {
    const pos = toCanvas(item.x, item.y);
    const w = item.width * SCALE;
    const d = item.depth * SCALE;
    const handleSize = 10;
    const corners = [
      { corner: 'tl', x: pos.x, y: pos.y },
      { corner: 'tr', x: pos.x + w, y: pos.y },
      { corner: 'bl', x: pos.x, y: pos.y + d },
      { corner: 'br', x: pos.x + w, y: pos.y + d },
    ];
    for (const c of corners) {
      if (Math.abs(px - c.x) < handleSize && Math.abs(py - c.y) < handleSize) {
        return c.corner;
      }
    }
    return null;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMousePos(e);
    const item = findFurnitureAt(x, y);
    if (item) {
      onSelectFurniture(item.id);
      if (selectedId === item.id) {
        const corner = isOnResizeHandle(x, y, item);
        if (corner) {
          setResizing({ id: item.id, corner });
          return;
        }
      }
      const pos = toCanvas(item.x, item.y);
      setDragging({ id: item.id, offsetX: x - pos.x, offsetY: y - pos.y });
    } else {
      onSelectFurniture(null);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const { x, y } = getMousePos(e);
      const meters = toMeters(x - dragging.offsetX, y - dragging.offsetY);
      const item = furniture.find(f => f.id === dragging.id);
      if (!item) return;
      const nx = Math.max(0, Math.min(roomWidth - item.width, meters.x));
      const ny = Math.max(0, Math.min(roomDepth - item.depth, meters.y));
      onUpdateFurniture(dragging.id, { x: Math.round(nx * 20) / 20, y: Math.round(ny * 20) / 20 });
    }
    if (resizing) {
      const { x, y } = getMousePos(e);
      const item = furniture.find(f => f.id === resizing.id);
      if (!item) return;
      const meters = toMeters(x, y);
      let newW = item.width;
      let newD = item.depth;
      if (resizing.corner.includes('r')) newW = Math.max(0.3, meters.x - item.x);
      if (resizing.corner.includes('b')) newD = Math.max(0.3, meters.y - item.y);
      onUpdateFurniture(resizing.id, {
        width: Math.round(newW * 10) / 10,
        depth: Math.round(newD * 10) / 10,
      });
    }
  };

  const onMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-background p-4">
      <canvas
        ref={canvasRef}
        style={{ width: canvasW, height: canvasH, cursor: dragging ? 'grabbing' : 'default' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
    </div>
  );
}
