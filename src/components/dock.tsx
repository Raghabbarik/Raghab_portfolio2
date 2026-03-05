
'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'framer-motion';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mousePos = useTransform(mouseX, val => {
    if (val === Infinity) return 0;
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(mousePos, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary-gradient shadow-lg ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-10 w-fit whitespace-pre rounded-md border border-border/50 bg-card px-2 py-0.5 text-xs text-foreground`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`flex items-center justify-center text-primary-foreground ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  magnification = 60,
  baseItemSize = 44,
  distance = 80,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.pageX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${className} flex items-end gap-3 rounded-2xl bg-card/80 backdrop-blur-md p-2 border border-border/20 shadow-2xl`}
      role="toolbar"
      aria-label="Application dock"
    >
      {items.map((item, index) => (
        <DockItem
          key={index}
          onClick={item.onClick}
          className={item.className}
          mouseX={mouseX}
          spring={spring}
          distance={distance}
          magnification={magnification}
          baseItemSize={baseItemSize}
        >
          <DockIcon>{item.icon}</DockIcon>
          <DockLabel>{item.label}</DockLabel>
        </DockItem>
      ))}
    </motion.div>
  );
}
