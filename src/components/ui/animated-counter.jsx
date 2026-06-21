"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export function AnimatedCounter({ value, duration = 1.5 }) {
  const count = useMotionValue(0);
  
  // Format the number to string and handle rounding
  const rounded = useTransform(count, (latest) => 
    Intl.NumberFormat("en-US").format(Math.floor(latest))
  );

  useEffect(() => {
    // Animate from 0 to the target value when mounted or when value changes
    const controls = animate(count, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [count, value, duration]);

  return <motion.span>{rounded}</motion.span>;
}
