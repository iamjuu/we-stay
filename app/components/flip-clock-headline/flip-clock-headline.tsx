"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const DEFAULT_PHRASES = [
  "Bring everyone home.",
  "Your land, your legacy.",
  "From someday to today.",
  "Let your land work too.",
  // "Move forward confidently",
];

const TYPE_MS = 58;
const DELETE_MS = 36;
const HOLD_MS = 3000;
const BETWEEN_PHRASES_MS = 420;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function stablePhrasesKey(phrases: string[]) {
  return phrases.join("\0");
}

type FlipClockHeadlineProps = {
  phrases?: string[];
  className?: string;
  style?: CSSProperties;
  /** Fill color for the insertion bar (thick vertical line, like the reference screenshot) */
  caretClassName?: string;
};

export default function FlipClockHeadline({
  phrases = DEFAULT_PHRASES,
  className = "",
  style,
  caretClassName = "bg-[#0C1B2A]",
}: FlipClockHeadlineProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState("");
  const [a11yPhrase, setA11yPhrase] = useState("");

  const phrasesKey = stablePhrasesKey(phrases);
  const phrasesRef = useRef(phrases);
  phrasesRef.current = phrases;

  // phrases content identity is keyed by phrasesKey (array ref may change without rerun)
  useEffect(() => {
    const phrasesSnap = phrasesRef.current;
    if (phrasesSnap.length === 0) {
      setVisible("");
      setA11yPhrase("");
      return;
    }

    if (reducedMotion) {
      const first = phrasesSnap[0] ?? "";
      setVisible(first);
      setA11yPhrase(first.trim());
      return;
    }

    let cancelled = false;
    let phraseIdx = 0;
    let charIdx = 0;
    type Phase = "typing" | "hold" | "deleting" | "between";
    let phase: Phase = "typing";

    let handle: ReturnType<typeof globalThis.setTimeout>;

    const clear = () => {
      globalThis.clearTimeout(handle);
    };

    const schedule = (delay: number, fn: () => void) => {
      clear();
      handle = globalThis.setTimeout(fn, delay);
    };

    const step = () => {
      if (cancelled) return;

      const full = phrasesRef.current[phraseIdx] ?? "";

      if (phase === "typing") {
        if (charIdx < full.length) {
          charIdx += 1;
          setVisible(full.slice(0, charIdx));
          schedule(TYPE_MS, step);
        } else {
          setA11yPhrase(full.trim());
          phase = "hold";
          schedule(HOLD_MS, step);
        }
        return;
      }

      if (phase === "hold") {
        phase = "deleting";
        schedule(DELETE_MS, step);
        return;
      }

      if (phase === "deleting") {
        if (charIdx > 0) {
          charIdx -= 1;
          setVisible(full.slice(0, charIdx));
          schedule(DELETE_MS, step);
        } else {
          phraseIdx = (phraseIdx + 1) % phrasesRef.current.length;
          phase = "between";
          schedule(BETWEEN_PHRASES_MS, step);
        }
        return;
      }

      phase = "typing";
      schedule(TYPE_MS, step);
    };

    charIdx = 0;
    phraseIdx = 0;
    phase = "typing";
    setVisible("");
    setA11yPhrase("");
    schedule(TYPE_MS, step);

    return () => {
      cancelled = true;
      clear();
    };
  }, [phrasesKey, reducedMotion]);

  return (
    <>
      <style>{`
        @keyframes typewriter-caret-blink {
          0%,
          45% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        .typewriter-caret {
          display: inline-block;
          width: 0.09em;
          min-width: 4px;
          height: 0.88em;
          margin-left: 0.055em;
          vertical-align: -0.14em;
          border-radius: 1px;
          animation: typewriter-caret-blink 1s step-end infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .typewriter-caret {
            animation: none;
            opacity: 1;
          }
        }
        .typewriter-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
      <div className="relative mx-auto max-w-full">
        <p
          className={`mx-auto inline max-w-full text-center ${className}`}
          style={style}
          aria-hidden
        >
          <span className="wrap-anywhere italic">{visible}</span>
          <span className={`typewriter-caret ${caretClassName}`} aria-hidden />
        </p>
        <span className="typewriter-sr-only" aria-live="polite">
          {reducedMotion ? visible.trim() : a11yPhrase}
        </span>
      </div>
    </>
  );
}
