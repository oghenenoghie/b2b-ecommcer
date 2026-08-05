"use client";

import { motion, useReducedMotion } from "framer-motion";

// One hero moment max, everything else is quiet fade-up. No parallax, no
// bounce, no infinite loops, no hover-lift shadows.
export function FadeIn({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
