"use client";

/**
 * Async framer-motion loader.
 *
 * Renders plain HTML elements immediately so hydration finishes fast
 * (hamburger menu works instantly). Once framer-motion loads in the
 * background, components re-render as real motion elements with full
 * animation support. No visible flash — same content either way.
 */

import {
  forwardRef,
  createElement,
  useState,
  useEffect,
  type ReactNode,
} from "react";

/* ── Async loader ────────────────────────────────────────────────────── */

let lib: typeof import("framer-motion") | null = null;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  import("framer-motion").then((mod) => {
    lib = mod;
    listeners.forEach((fn) => fn());
  });
}

function useMotionReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (lib) { setReady(true); return; }
    const cb = () => setReady(true);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return ready;
}

/* ── Motion-specific props to accept + strip ─────────────────────────── */

interface MotionProps {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  layout?: unknown;
  layoutId?: unknown;
  whileHover?: unknown;
  whileTap?: unknown;
  whileInView?: unknown;
  whileFocus?: unknown;
  whileDrag?: unknown;
  variants?: unknown;
  onAnimationComplete?: unknown;
  onAnimationStart?: unknown;
  dragConstraints?: unknown;
  drag?: unknown;
  dragElastic?: unknown;
  dragMomentum?: unknown;
  onDrag?: unknown;
  onDragEnd?: unknown;
  onDragStart?: unknown;
}

const MOTION_KEYS = new Set(Object.keys({
  initial: 1, animate: 1, exit: 1, transition: 1, layout: 1, layoutId: 1,
  whileHover: 1, whileTap: 1, whileInView: 1, whileFocus: 1, whileDrag: 1,
  variants: 1, onAnimationComplete: 1, onAnimationStart: 1, dragConstraints: 1,
  drag: 1, dragElastic: 1, dragMomentum: 1, onDrag: 1, onDragEnd: 1, onDragStart: 1,
} satisfies Record<keyof MotionProps, 1>));

function stripMotion(props: Record<string, unknown>) {
  const clean: Record<string, unknown> = {};
  for (const k in props) {
    if (!MOTION_KEYS.has(k)) clean[k] = props[k];
  }
  return clean;
}

/* ── Component factory ───────────────────────────────────────────────── */

function createMotionComponent<P extends React.HTMLAttributes<HTMLElement>>(tag: string) {
  const Comp = forwardRef<HTMLElement, P & MotionProps>((props, ref) => {
    const ready = useMotionReady();

    if (ready && lib) {
      const M = (lib.motion as unknown as Record<string, React.ElementType>)[tag];
      return createElement(M, { ...props, ref });
    }

    return createElement(tag, { ...stripMotion(props as unknown as Record<string, unknown>), ref });
  });
  Comp.displayName = `motion.${tag}`;
  return Comp;
}

/* ── Exports ─────────────────────────────────────────────────────────── */

export const motion = {
  div: createMotionComponent<React.HTMLAttributes<HTMLDivElement>>("div"),
  p: createMotionComponent<React.HTMLAttributes<HTMLParagraphElement>>("p"),
  h1: createMotionComponent<React.HTMLAttributes<HTMLHeadingElement>>("h1"),
  h2: createMotionComponent<React.HTMLAttributes<HTMLHeadingElement>>("h2"),
  a: createMotionComponent<React.AnchorHTMLAttributes<HTMLAnchorElement>>("a"),
  button: createMotionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>>("button"),
};

export function AnimatePresence({ children, ...props }: { children: ReactNode; initial?: boolean; mode?: "sync" | "popLayout" | "wait"; onExitComplete?: () => void }) {
  const ready = useMotionReady();
  if (ready && lib) {
    return createElement(lib.AnimatePresence, props, children);
  }
  return <>{children}</>;
}

