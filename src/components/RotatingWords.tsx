"use client";

import { useEffect, useState } from "react";

type Props = {
  words: string[];
  intervalMs?: number;
  transitionMs?: number;
  className?: string;
};

export default function RotatingWords({
  words,
  intervalMs = 3000,
  transitionMs = 400,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (words.length <= 1) return;
    const fadeOut = setTimeout(() => setPhase("out"), intervalMs - transitionMs);
    const advance = setTimeout(() => {
      setIndex((prev) => (prev + 1) % words.length);
      setPhase("in");
    }, intervalMs);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(advance);
    };
  }, [index, words.length, intervalMs, transitionMs]);

  return (
    <span
      aria-live="polite"
      style={{ transitionDuration: `${transitionMs}ms` }}
      className={`inline-block align-baseline transition-all ease-out motion-reduce:transition-none ${
        phase === "in"
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {words[index]}
    </span>
  );
}
