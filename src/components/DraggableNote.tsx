import React, { useRef, useState, useCallback } from 'react';

interface DraggableNoteProps {
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  onDrag?: (position: { x: number; y: number }) => void;
  className?: string;
  disabled?: boolean;
}

export const DraggableNote: React.FC<DraggableNoteProps> = ({
  children,
  defaultPosition = { x: 0, y: 0 },
  onDrag,
  className = '',
  disabled = false
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number }>({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0
  });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position, disabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    const newPosition = {
      x: dragRef.current.startPosX + deltaX,
      y: dragRef.current.startPosY + deltaY
    };

    setPosition(newPosition);
    onDrag?.(newPosition);
  }, [isDragging, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  // Touch events for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    setIsDragging(true);
    
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: position.x,
      startPosY: position.y
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }, [position, disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragRef.current.startX;
    const deltaY = touch.clientY - dragRef.current.startY;
    
    const newPosition = {
      x: dragRef.current.startPosX + deltaX,
      y: dragRef.current.startPosY + deltaY
    };

    setPosition(newPosition);
    onDrag?.(newPosition);
  }, [isDragging, onDrag]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  return (
    <div
      ref={elementRef}
      className={`absolute select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isDragging ? 1000 : 1
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
};

export default DraggableNote;