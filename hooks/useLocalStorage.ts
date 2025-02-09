"use client";

import { useState, useEffect } from "react";
import { FinanceData, defaultFinanceData } from "@/types/finance";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);

      // If this is finance data, ensure metadata exists
      if (key === "financeData") {
        const financeData = parsedItem as FinanceData;
        if (!financeData.metadata) {
          const now = new Date().toISOString();
          return {
            ...financeData,
            metadata: {
              lastSaved: now,
              lastModified: now,
            },
          };
        }
      }

      return parsedItem;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [key, value]);

  return [value, setValue] as const;
}