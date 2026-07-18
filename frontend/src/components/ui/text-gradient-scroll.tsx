"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { cn } from "../../lib/utils";

type TextOpacityEnum = "none" | "soft" | "medium";
type ViewTypeEnum = "word" | "letter";

type TextGradientScrollType = {
  text: string;
  type?: ViewTypeEnum;
  className?: string;
  textOpacity?: TextOpacityEnum;
  key?: React.Key;
};

type LetterType = {
  children: React.ReactNode | string;
  progress: MotionValue<number>;
  range: number[];
  key?: React.Key;
};

type WordType = {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: number[];
  key?: React.Key;
};

type CharType = {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: number[];
  key?: React.Key;
};

type TextGradientScrollContextType = {
  textOpacity?: TextOpacityEnum;
  type?: ViewTypeEnum;
  hasScrolled: boolean;
};

const TextGradientScrollContext = createContext<TextGradientScrollContextType>(
  { hasScrolled: false }
);

function useGradientScroll() {
  const context = useContext(TextGradientScrollContext);
  return context;
}

function TextGradientScroll({
  text,
  className,
  type = "letter",
  textOpacity = "soft",
}: TextGradientScrollType) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");

  return (
    <TextGradientScrollContext.Provider value={{ textOpacity, type, hasScrolled }}>
      <p ref={ref} className={cn("relative flex m-0 flex-wrap", className)}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return type === "word" ? (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          ) : (
            <Letter key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Letter>
          );
        })}
      </p>
    </TextGradientScrollContext.Provider>
  );
}

export { TextGradientScroll };

const Word = ({ children, progress, range }: WordType) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const { hasScrolled } = useGradientScroll();

  return (
    <span className="relative mr-[0.25em]">
      <span style={{ position: "absolute", opacity: 0.1 }}>{children}</span>
      <motion.span style={{ transition: "all .5s", opacity: hasScrolled ? opacity : 1 }}>
        {children}
      </motion.span>
    </span>
  );
};

const Letter = ({ children, progress, range }: LetterType) => {
  const { hasScrolled } = useGradientScroll();

  if (typeof children === "string") {
    const amount = range[1] - range[0];
    const step = amount / children.length;

    return (
      <span className="relative mr-[0.25em]">
        {children.split("").map((char: string, i: number) => {
          const start = range[0] + i * step;
          const end = range[0] + (i + 1) * step;
          return (
            <Char key={`c_${i}`} progress={progress} range={[start, end]}>
              {char}
            </Char>
          );
        })}
      </span>
    );
  }
};

const Char = ({ children, progress, range }: CharType) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const { textOpacity, hasScrolled } = useGradientScroll();

  return (
    <span>
      <span
        className={cn("absolute", {
          "opacity-0": textOpacity == "none",
          "opacity-10": textOpacity == "soft",
          "opacity-30": textOpacity == "medium",
        })}
      >
        {children}
      </span>
      <motion.span
        style={{
          transition: "all .5s",
          opacity: hasScrolled ? opacity : 1,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};
