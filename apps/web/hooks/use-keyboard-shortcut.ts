import { useEffect, useCallback } from 'react';

type KeyCombination = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

export function useKeyboardShortcut(
  keyCombination: KeyCombination,
  callback: (event: KeyboardEvent) => void,
  element: HTMLElement | Window = window
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, ctrlKey, shiftKey, altKey, metaKey } = keyCombination;

      if (
        event.key === key &&
        (ctrlKey === undefined || event.ctrlKey === ctrlKey) &&
        (shiftKey === undefined || event.shiftKey === shiftKey) &&
        (altKey === undefined || event.altKey === altKey) &&
        (metaKey === undefined || event.metaKey === metaKey)
      ) {
        event.preventDefault();
        callback(event);
      }
    },
    [keyCombination, callback]
  );

  useEffect(() => {
    element.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, element]);
}

// Common keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SAVE: { key: 's', ctrlKey: true },
  COPY: { key: 'c', ctrlKey: true },
  PASTE: { key: 'v', ctrlKey: true },
  CUT: { key: 'x', ctrlKey: true },
  UNDO: { key: 'z', ctrlKey: true },
  REDO: { key: 'y', ctrlKey: true },
  DELETE: { key: 'Delete' },
  ESCAPE: { key: 'Escape' },
  ENTER: { key: 'Enter' },
  SPACE: { key: ' ' },
  TAB: { key: 'Tab' },
  ARROW_UP: { key: 'ArrowUp' },
  ARROW_DOWN: { key: 'ArrowDown' },
  ARROW_LEFT: { key: 'ArrowLeft' },
  ARROW_RIGHT: { key: 'ArrowRight' },
  SEARCH: { key: 'k', metaKey: true },
  NEW: { key: 'n', metaKey: true },
} as const;
