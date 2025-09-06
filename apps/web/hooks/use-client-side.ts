'use client';

import { useState, useEffect } from 'react';

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return isMounted;
}

export function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      try {
        const item = localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        setStoredValue(initialValue);
      }
    }
  }, [isMounted, key, initialValue]);

  const setValue = (value: any) => {
    if (!isMounted) return;

    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
