// app/hooks/useCanvas.js
import { useState, useEffect } from 'react';

export function useCanvas() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openCanvas = () => {
    setIsOpen(true);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const closeCanvas = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 300);
  };

  return {
    isOpen,
    isAnimating,
    openCanvas,
    closeCanvas
  };
}