
"use client";

import React, { useRef, useEffect, memo } from "react";
import { gsap } from "gsap";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

type ShuffleProps = {
  text: string;
  className?: string;
  shuffleDirection?: "left" | "right" | "top" | "bottom";
  duration?: number;
  animationMode?: "chars" | "words" | "lines" | "all" | "evenodd";
  shuffleTimes?: number;
  ease?: string;
  stagger?: number | { from?: "start" | "center" | "end"; each: number };
  threshold?: number;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  respectReducedMotion?: boolean;
  delay?: number;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// ScrambleTextPlugin for GSAP
const ScrambleTextPlugin = {
  name: "scrambleText",
  version: "3.12.5",
  init(target: any, config: any) {
    this.target = target;
    this.vars = config;
    this.chars = config.chars || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    this.speed = config.speed || 1;
    this.originalText = target.textContent;
    this.text = config.text || this.originalText;
    this.tweenLength = config.tweenLength !== false && this.originalText.length !== this.text.length;
    this.progress = 0;
    this.scrambling = false;
  },

  render(progress: number, data: any) {
    const { target, text, originalText, chars, speed, tweenLength } = data.vars;
    let newText = "";
    const originalLength = originalText.length;
    const newLength = text.length;

    let l = originalLength;
    if (tweenLength) {
      l = Math.round(originalLength + (newLength - originalLength) * progress);
    }
    
    let p = originalLength * progress * speed;

    if(progress === 1) {
        newText = text;
    } else {
        for (let i = 0; i < l; i++) {
            if (i < p) {
                newText += text[i] || "";
            } else {
                newText += chars[Math.floor(Math.random() * chars.length)];
            }
        }
    }
    data.target.textContent = newText;
  }
};


const Shuffle = memo(
  ({
    text,
    className = "",
    shuffleDirection = "right",
    duration = 0.5,
    animationMode = "chars",
    shuffleTimes = 1,
    ease = "power3.inOut",
    stagger = 0.05,
    threshold = 0.1,
    triggerOnce = true,
    triggerOnHover = false,
    respectReducedMotion = true,
    delay = 0,
  }: ShuffleProps) => {
    const rootRef = useRef<HTMLHeadingElement>(null);
    const { ref, inView } = useInView({
      threshold,
      triggerOnce,
    });
    const isAnimating = useRef(false);

    const getAnimationTargets = () => {
      const el = rootRef.current;
      if (!el) return [];
      switch (animationMode) {
        case "chars":
          return Array.from(el.querySelectorAll(".char"));
        case "words":
          return Array.from(el.querySelectorAll(".word"));
        case "lines":
          return Array.from(el.querySelectorAll(".line"));
        case "evenodd":
            const even = Array.from(el.querySelectorAll(".char:nth-of-type(2n)"));
            const odd = Array.from(el.querySelectorAll(".char:nth-of-type(2n+1)"));
            return [odd, even];
        default:
          return [el];
      }
    };
    
    const splitText = (inputText: string) => {
        if (animationMode === 'lines') {
            return inputText.split('\n').map((line, i) => `<span class="line-wrapper" style="display:inline-block; overflow:hidden;"><span class="line">${line}</span></span>`).join('');
        }
        if (animationMode === 'words') {
             return inputText.split(' ').map(word => `<span class="word-wrapper" style="display:inline-block; overflow:hidden;"><span class="word">${word}</span></span>`).join(' ');
        }
        if (animationMode === 'chars' || animationMode === 'evenodd') {
            let result = '';
            inputText.split(' ').forEach(word => {
                result += '<span class="word-wrapper" style="display:inline-block;">';
                result += word.split('').map(char => `<span class="char-wrapper" style="display:inline-block; overflow:hidden;"><span class="char">${char === ' ' ? '&nbsp;' : char}</span></span>`).join('');
                result += '</span>&nbsp;';
            });
            return result.slice(0, -6);
        }
        return `<span class="all-wrapper" style="display:inline-block; overflow:hidden;"><span class="all">${inputText}</span></span>`;
    }

    const animate = () => {
      if (!rootRef.current || isAnimating.current) return;
      isAnimating.current = true;

      const targets = getAnimationTargets();
      if (targets.length === 0) {
        isAnimating.current = false;
        return;
      }
      
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
        delay: delay
      });
      
      const staggerValue = typeof stagger === 'number' ? stagger : stagger.each;

      targets.flat().forEach((target, index) => {
          const el = target as HTMLElement;
          const originalText = el.textContent || "";
          if (!originalText) return;
          
          el.textContent = "";

          tl.to(el, {
              duration: duration,
              scrambleText: {
                  text: originalText,
                  chars: CHARS,
                  speed: 1,
                  rightToLeft: shuffleDirection === 'right',
              },
              ease: ease,
          }, staggerValue > 0 ? index * staggerValue : 0);
      });
    };

    useEffect(() => {
        if (rootRef.current) {
            gsap.registerPlugin(ScrambleTextPlugin);
            rootRef.current.innerHTML = splitText(text);
            // Assign ref for useInView
            ref(rootRef.current);
        }
    }, [text, animationMode, ref]);

    useEffect(() => {
      const prefersReducedMotion =
        respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!triggerOnHover && inView && !prefersReducedMotion) {
        animate();
      }
    }, [inView, respectReducedMotion, triggerOnHover]);

    const handleHover = () => {
      const prefersReducedMotion =
        respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (triggerOnHover && !prefersReducedMotion) {
        animate();
      }
    };

    return (
      <h2
        ref={rootRef}
        onMouseEnter={triggerOnHover ? handleHover : undefined}
        className={cn("shuffle-text", className)}
      >
        {/* Content is set via innerHTML */}
      </h2>
    );
  }
);
Shuffle.displayName = "Shuffle";

export default Shuffle;

