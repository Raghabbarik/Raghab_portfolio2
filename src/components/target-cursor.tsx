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
  parallaxOn = false,
  parallaxMultiplier = 5,
  className,
}) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });
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
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave, handlePageLeave, hideDefaultCursor]);

  const cursorStyle: CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    animationDuration: `${spinDuration}s`,
    opacity: isVisible ? 1 : 0,
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
