
import React from 'react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  isVisible: boolean;
  onDrop: () => void;
  className?: string;
}

const DropZone: React.FC<DropZoneProps> = ({ isVisible, onDrop, className }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 h-1 bg-blue-500 rounded-full z-10 transition-all duration-200",
        "before:content-[''] before:absolute before:-top-2 before:-bottom-2 before:left-0 before:right-0",
        className
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    />
  );
};

export default DropZone;
