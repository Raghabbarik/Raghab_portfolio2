
"use client";

import { useEffect, useState, memo } from 'react';
import { cn } from '@/lib/utils';

interface TextTypeProps {
  texts: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

const TextType: React.FC<TextTypeProps> = ({
  texts,
  typingSpeed = 150,
  pauseDuration = 1500,
  className,
  cursorClassName,
}) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const handleTyping = () => {
      const currentString = texts[textIndex];

      if (isDeleting) {
        if (charIndex > 0) {
          setCurrentText(currentString.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        if (charIndex < currentString.length) {
          setCurrentText(currentString.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, textIndex, texts, pauseDuration, typingSpeed]);

  return (
    <span className={cn("relative", className)}>
      {currentText}
      <span
        className={cn(
          'animate-pulse-slow',
          'absolute right-[-0.2em] top-0 bottom-0 w-[2px] bg-current',
          cursorClassName
        )}
      />
    </span>
  );
};

export default memo(TextType);
