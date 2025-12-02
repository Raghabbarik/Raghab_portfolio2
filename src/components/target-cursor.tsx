
"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  parallaxOn?: boolean;
  parallaxMultiplier?: number;
  className?: string;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  spinDuration = 1,
  hideDefaultCursor = false,
  className,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: -100, y: -100, dx: -100, dy: -100 });
  const animationFrameRef = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    positionRef.current.x = e.clientX;
    positionRef.current.y = e.clientY;
  }, [isVisible]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);
  
  const handlePageLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsMouseDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handlePageLeave);
    
    if (hideDefaultCursor) {
        document.body.classList.add('hide-cursor');
    }

    const targets = document.querySelectorAll(".cursor-target");
    targets.forEach((target) => {
      target.addEventListener("mouseenter", handleMouseEnter);
      target.addEventListener("mouseleave", handleMouseLeave);
    });
    
    const animate = () => {
        if (cursorRef.current) {
            positionRef.current.dx += (positionRef.current.x - positionRef.current.dx) * 0.2;
            positionRef.current.dy += (positionRef.current.y - positionRef.current.dy) * 0.2;
            cursorRef.current.style.transform = `translate(${positionRef.current.dx}px, ${positionRef.current.dy}px)`;
        }
        animationFrameRef.current = requestAnimationFrame(animate);
    }
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handlePageLeave);
       if (hideDefaultCursor) {
        document.body.classList.remove('hide-cursor');
      }
      targets.forEach((target) => {
        target.removeEventListener("mouseenter", handleMouseEnter);
        target.removeEventListener("mouseleave", handleMouseLeave);
      });
      if(animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave, handlePageLeave, hideDefaultCursor]);

  const cursorStyle: CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    transform: `translate(${positionRef.current.dx}px, ${positionRef.current.dy}px)`,
    animationDuration: `${spinDuration}s`,
    opacity: isVisible ? 1 : 0,
    willChange: 'transform',
    pointerEvents: 'none',
  };

  const cursorClasses = cn(
    "target-cursor",
    { "is-hovering": isHovering, "is-mouse-down": isMouseDown },
    className
  );

  return (
    <div ref={cursorRef} className={cursorClasses} style={cursorStyle}></div>
  );
};

export default TargetCursor;
