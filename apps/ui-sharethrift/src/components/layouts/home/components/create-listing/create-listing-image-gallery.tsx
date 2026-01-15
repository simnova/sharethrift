import type { RefObject, FC } from 'react';
import { useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { MainImage } from './components/main-image.tsx';
import { Thumbnail } from './components/thumbnail.tsx';
import styles from './image-gallery.module.css';

function useFileLimit(
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

interface ImageGalleryProps {
	uploadedImages: string[];
	onImageRemove: (imageUrl: string) => void;
	mainFileInputRef: RefObject<HTMLInputElement | null>;
	additionalFileInputRef: RefObject<HTMLInputElement | null>;
}

export const ImageGallery: FC<ImageGalleryProps> = ({
	uploadedImages,
	onImageRemove,
	mainFileInputRef,
	additionalFileInputRef,
}) => {
	useFileLimit(mainFileInputRef, uploadedImages.length);
	useFileLimit(additionalFileInputRef, uploadedImages.length);

	const [first, ...rest] = uploadedImages.filter(Boolean);

	return (
		<div className={styles['root']}>
			{/* Spacer to align with Item Details h1 */}
			<div style={{ height: '24px', marginBottom: '16px' }}></div>
			{first ? (
				<>
					<MainImage
						src={first}
						count={uploadedImages.length}
						onRemove={() => onImageRemove(first)}
					/>
					<div className={styles['thumbs']}>
						{rest.map((src) => (
							<Thumbnail
								key={src}
								src={src}
								onRemove={() => onImageRemove(src)}
							/>
						))}
						{uploadedImages.length < 5 && (
							<button
								type="button"
								onClick={() => additionalFileInputRef.current?.click()}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										additionalFileInputRef.current?.click();
									}
								}}
								className={styles['uploadBtn']}
								aria-label="Upload additional image"
							>
								<PlusOutlined className={styles['plusIconSmall']} />
							</button>
						)}
					</div>
				</>
			) : (
				<div className={styles['uploadArea']}>
					<button
						type="button"
						onClick={() => mainFileInputRef.current?.click()}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								mainFileInputRef.current?.click();
							}
						}}
						className={styles['uploadButton']}
						aria-label="Upload image"
					>
						<PlusOutlined className={styles['plusIcon']} />
						<div className={styles['uploadText']}>
							Click to upload images, up to 5
						</div>
					</button>
				</div>
			)}
		</div>
	);
};

