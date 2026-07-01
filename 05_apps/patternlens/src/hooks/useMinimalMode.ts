"use client";

import { useState } from "react";

// Initialize from localStorage on client side
function getInitialMinimalMode(): boolean {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("silenceMinimalMode");
  return saved === "true";
}

export function useMinimalMode() {
  const [minimalMode, setMinimalMode] = useState(getInitialMinimalMode);

  const toggleMinimalMode = () => {
    const newValue = !minimalMode;
    setMinimalMode(newValue);
    localStorage.setItem("silenceMinimalMode", String(newValue));
  };

  // loaded is always true since we initialize synchronously
  return { minimalMode, toggleMinimalMode, loaded: true };
}
