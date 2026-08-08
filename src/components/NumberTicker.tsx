import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NumberTickerProps {
  value: string | number;
  className?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  className = "",
}) => {
  const stringValue = String(value);

  return (
    <span className={`inline-flex items-center overflow-hidden ${className}`}>
      {stringValue.split("").map((char, index) => {
        // If it's a comma, space, or non-digit symbol, render static
        if (isNaN(Number(char))) {
          return (
            <span key={`symbol-${index}`} className="inline-block">
              {char}
            </span>
          );
        }

        // Rolling slot digit animation for numbers
        return (
          <span
            key={`digit-col-${index}`}
            className="relative inline-block overflow-hidden h-[1.2em] leading-[1.2]"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${index}-${char}`}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1], 
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
};
