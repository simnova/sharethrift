import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Custom hook that debounces a value change with optional immediate trigger
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns [debouncedValue, triggerImmediate] - The debounced value and a function to trigger immediate update
 */
export function useDebouncedValue<T>(
	value: T,
	delay = 500,
): [T, () => void] {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const valueRef = useRef<T>(value);

	// Keep valueRef up to date
	valueRef.current = value;

	// Function to immediately update the debounced value
	const triggerImmediate = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		setDebouncedValue(valueRef.current);
	}, []);

	useEffect(() => {
		// Set up the timeout
		timerRef.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timeout if value changes before delay
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [value, delay]);

	return [debouncedValue, triggerImmediate];
}
