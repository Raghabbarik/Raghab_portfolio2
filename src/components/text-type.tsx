
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TextTypeProps {
  text: string | string[];
  typingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  className?: string;
  initialDelay?: number;
}

const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '|',
  className = '',
  initialDelay = 0,
}) => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReady, setIsReady] = useState(initialDelay === 0);
  const texts = Array.isArray(text) ? text : [text];

  useEffect(() => {
    if (initialDelay > 0) {
      const delayTimeout = setTimeout(() => {
        setIsReady(true);
      }, initialDelay);
      return () => clearTimeout(delayTimeout);
    }
  }, [initialDelay]);

  useEffect(() => {
    if (!isReady || !texts.length) return;

    const handleTyping = () => {
      const currentString = texts[textIndex];

      if (isDeleting) {
        // Deleting
        if (charIndex > 0) {
          setCurrentText(currentString.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Finished deleting
          setIsDeleting(false);
          setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      } else {
        // Typing
        if (charIndex < currentString.length) {
          setCurrentText(currentString.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Finished typing, pause and then start deleting if loop is desired
          if (texts.length > 1 || pauseDuration !== Infinity) {
            setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, pauseDuration, isReady]);

  return (
    <span className={className}>
      {currentText}
      {showCursor && <span className="animate-pulse">{cursorCharacter}</span>}
    </span>
  );
};

export default TextType;
