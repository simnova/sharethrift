import type { RefObject, FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useFileLimit } from './hooks/use-file-limit';
import { MainImage } from './components/main-image';
import { Thumbnail } from './components/thumbnail';
import styles from './image-gallery.module.css';

export interface ImageGalleryProps {
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
		<div className={styles.root}>
			{/* Spacer to align with Item Details h1 */}
			<div style={{ height: '24px', marginBottom: '16px' }}></div>
			{first ? (
				<>
					<MainImage
						src={first}
						count={uploadedImages.length}
						onRemove={() => onImageRemove(first)}
					/>
					<div className={styles.thumbs}>
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
								className={styles.uploadBtn}
								aria-label="Upload additional image"
							>
								<PlusOutlined className={styles.plusIconSmall} />
							</button>
						)}
					</div>
				</>
			) : (
				<div className={styles.uploadArea}>
					<button
						type="button"
						onClick={() => mainFileInputRef.current?.click()}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								mainFileInputRef.current?.click();
							}
						}}
						className={styles.uploadButton}
						aria-label="Upload image"
					>
						<PlusOutlined className={styles.plusIcon} />
						<div className={styles.uploadText}>
							Click to upload images, up to 5
						</div>
					</button>
				</div>
			)}
		</div>
	);
};

export default ImageGallery;
