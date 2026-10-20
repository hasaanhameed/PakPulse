"use client";

import { useEffect, useState } from "react";

/**
 * Reads CSS color tokens from the root element once mounted.
 * Recharts needs real color values, so charts use this instead of `var(--token)`,
 * which keeps globals.css the single place colors are defined.
 * Returns null until mounted, so server and client render the same placeholder.
 */
export function useThemeTokens(tokens: string[]): Record<string, string> | null {
  const [values, setValues] = useState<Record<string, string> | null>(null);
  const key = tokens.join(",");

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setValues(Object.fromEntries(key.split(",").map((t) => [t, cs.getPropertyValue(t).trim()])));
  }, [key]);

  return values;
}
