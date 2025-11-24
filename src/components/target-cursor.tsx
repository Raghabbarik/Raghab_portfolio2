
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
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isVisible) setIsVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });

    if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
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

  useEffect(() => {
    if (parallaxOn) {
      const parallaxTargets = document.querySelectorAll<HTMLElement>("[data-parallax]");
      const handleParallax = (e: MouseEvent) => {
        parallaxTargets.forEach((target) => {
          // const speed = (parseInt(target.dataset.parallax || "0") || parallaxMultiplier);
          // const x = (window.innerWidth - e.pageX * speed) / 100;
          // const y = (window.innerHeight - e.pageY * speed) / 100;
          // target.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
      };
      window.addEventListener("mousemove", handleParallax);
      return () => window.removeEventListener("mousemove", handleParallax);
    }
  }, [parallaxOn, parallaxMultiplier]);

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
    <>
        <div ref={cursorRef} className={cursorClasses} style={cursorStyle}></div>
        <div ref={spotlightRef} className="spotlight" style={{ opacity: isVisible ? 1 : 0 }}></div>
    </>
  );
};

export default TargetCursor;
