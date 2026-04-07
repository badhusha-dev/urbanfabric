import React, { useEffect, useState, useRef } from 'react';

const CustomCursor = () => {
  const mainCursor = useRef(null);
  const secondaryCursor = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const secondaryPositionRef = useRef({ x: 0, y: 0 });
  
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInput, setIsInput] = useState(false);

  useEffect(() => {
    // Mobile Detection
    const checkMobile = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isTouch);
    };
    checkMobile();

    // Mouse Movement
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      positionRef.current.x = clientX;
      positionRef.current.y = clientY;

      if (mainCursor.current) {
        mainCursor.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
      }

      // Check for hover types
      const target = e.target;
      const isSelectable = target.closest('button, a, .selectable');
      const isInputField = target.closest('input, textarea, [contenteditable="true"]');
      
      setIsHovering(!!isSelectable);
      setIsInput(!!isInputField);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Smooth Secondary Follow logic
    let frameId;
    const followMouse = () => {
      const dx = positionRef.current.x - secondaryPositionRef.current.x;
      const dy = positionRef.current.y - secondaryPositionRef.current.y;
      
      secondaryPositionRef.current.x += dx * 0.15;
      secondaryPositionRef.current.y += dy * 0.15;

      if (secondaryCursor.current) {
        secondaryCursor.current.style.transform = `translate(${secondaryPositionRef.current.x}px, ${secondaryPositionRef.current.y}px)`;
      }

      frameId = requestAnimationFrame(followMouse);
    };
    followMouse();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (isMobile || isInput) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Primary Dot */}
      <div 
        ref={mainCursor}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-neon-green rounded-full shadow-[0_0_10px_rgba(0,255,163,1)] transition-all duration-150 ease-out z-10
          ${isClicking ? 'scale-[0.5]' : 'scale-100'}
        `}
      />
      
      {/* Secondary Ring */}
      <div 
        ref={secondaryCursor}
        className={`fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 border border-white/20 rounded-full backdrop-blur-[2px] transition-all duration-500 ease-out
          ${isHovering ? 'w-16 h-16 -ml-8 -mt-8 border-neon-blue bg-neon-blue/5 shadow-[0_0_20px_rgba(0,229,255,0.2)]' : ''}
          ${isClicking ? 'scale-[0.8] opacity-50' : 'scale-100 opacity-100'}
        `}
      >
         <div className={`absolute inset-0 rounded-full border-[0.5px] border-white/5 animate-ping opacity-10 
           ${isHovering ? 'border-neon-blue' : ''}
         `} />
      </div>
    </div>
  );
};

export default CustomCursor;
