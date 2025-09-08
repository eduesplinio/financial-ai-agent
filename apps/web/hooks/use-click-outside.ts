import { RefObject, useEffect } from 'react';

type Event = MouseEvent | TouchEvent;

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  excludeRefs?: Array<RefObject<HTMLElement>>
) {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      // Do nothing if clicking excluded elements
      if (
        excludeRefs &&
        excludeRefs.some(
          excludeRef =>
            excludeRef.current &&
            excludeRef.current.contains(event.target as Node)
        )
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, excludeRefs]);
}
