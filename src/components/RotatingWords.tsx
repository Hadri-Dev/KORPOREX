"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  phrases: string[];
  wordStaggerMs?: number;
  holdMs?: number;
  fadeMs?: number;
  className?: string;
};

/**
 * Cycles through phrases by revealing each word one at a time (rise + fade in),
 * holding the complete phrase, fading the whole phrase out, then advancing to
 * the next. Words are inline-blocks so they participate in normal line-wrapping
 * and don't overlap surrounding text in the parent heading.
 */
export default function RotatingWords({
  phrases,
  wordStaggerMs = 550,
  holdMs = 1800,
  fadeMs = 450,
  className = "",
}: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [wordsShown, setWordsShown] = useState(1);
  const [phase, setPhase] = useState<"building" | "holding" | "fading">("building");

  const words = useMemo(() => phrases[phraseIndex].split(" "), [phrases, phraseIndex]);

  useEffect(() => {
    if (phase === "building") {
      if (wordsShown < words.length) {
        const t = setTimeout(() => setWordsShown((n) => n + 1), wordStaggerMs);
        return () => clearTimeout(t);
      }
      setPhase("holding");
      return;
    }
    if (phase === "holding") {
      const t = setTimeout(() => setPhase("fading"), holdMs);
      return () => clearTimeout(t);
    }
    if (phase === "fading") {
      const t = setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % phrases.length);
        setWordsShown(1);
        setPhase("building");
      }, fadeMs);
      return () => clearTimeout(t);
    }
  }, [phase, wordsShown, words.length, phrases.length, wordStaggerMs, holdMs, fadeMs]);

  return (
    <span
      aria-live="polite"
      style={{ transitionDuration: `${fadeMs}ms` }}
      className={`transition-opacity motion-reduce:transition-none ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      } ${className}`}
    >
      {words.map((word, i) => (
        <span
          key={`${phraseIndex}-${i}`}
          className={`inline-block transition-all duration-500 ease-out motion-reduce:transition-none ${
            i > 0 ? "ml-[0.25em]" : ""
          } ${
            i < wordsShown
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
