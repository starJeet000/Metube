import { useRef, useCallback } from "react";

interface GestureActions {
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  onTripleTap?: () => void;
}

export function useVideoGestures(actions: GestureActions) {
  const clickCount = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    // Increase the click count every time the user taps
    clickCount.current += 1;

    // Clear the previous timer so it doesn't fire early
    if (timer.current) {
      clearTimeout(timer.current);
    }

    // If they hit 3 taps, fire immediately (no need to wait)
    if (clickCount.current === 3) {
      if (actions.onTripleTap) actions.onTripleTap();
      clickCount.current = 0;
      return;
    }

    // Otherwise, wait 300ms to see if they tap again
    timer.current = setTimeout(() => {
      if (clickCount.current === 1) {
        if (actions.onSingleTap) actions.onSingleTap();
      } else if (clickCount.current === 2) {
        if (actions.onDoubleTap) actions.onDoubleTap();
      }
      // Reset the counter after the action fires
      clickCount.current = 0;
    }, 300);
  }, [actions]);

  return handleTap;
}