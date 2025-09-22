import { useEffect } from 'react';
import type { RefObject } from 'react';
import { message } from 'antd';

export function useFileLimit(
	inputRef: RefObject<HTMLInputElement | null>,
	currentCount: number,
	maxCount = 5,
) {
	useEffect(() => {
		const handler = (e: Event) => {
			const input = e.target as HTMLInputElement;
			if (!input.files) {
				return;
			}
			const files = Array.from(input.files);
			const remaining = maxCount - currentCount;
			if (remaining <= 0) {
				input.value = '';
				message.info(`Maximum of ${maxCount} images allowed`);
				return;
			}
			if (files.length > remaining) {
				const dt = new DataTransfer();
				files.slice(0, remaining).forEach((f) => dt.items.add(f));
				input.files = dt.files;
				message.info(
					`${files.length} image${files.length > 1 ? 's' : ''} selected — only ${remaining} accepted`,
				);
			}
		};
		const el = inputRef.current;
		el?.addEventListener('change', handler);
		return () => el?.removeEventListener('change', handler);
	}, [inputRef, currentCount, maxCount]);
}
