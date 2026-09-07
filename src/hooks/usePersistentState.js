import { useEffect, useState } from "react";

/**
 * usePersistentState is a drop-in replacement for useState that keeps its
 * value in localStorage under `key`, so it survives a full page refresh.
 * It also listens for the browser's `storage` event so state stays in sync
 * if the same key changes in another tab/window.
 *
 * IMPORTANT: the initial value is read synchronously (inside useState's
 * lazy initializer), not in an effect — so the very first render already
 * has the persisted value instead of flashing the default and "resetting."
 */
export function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch (err) {
      console.error(`usePersistentState: failed to read "${key}"`, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error(`usePersistentState: failed to write "${key}"`, err);
    }
  }, [key, state]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== key) return;
      try {
        setState(
          event.newValue !== null ? JSON.parse(event.newValue) : defaultValue
        );
      } catch (err) {
        console.error(`usePersistentState: failed to sync "${key}"`, err);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [state, setState];
}
