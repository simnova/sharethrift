import React from 'react';
import { Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

export interface ImageGalleryProps {
	uploadedImages: string[];
	onImageRemove: (imageUrl: string) => void;
	mainFileInputRef: React.RefObject<HTMLInputElement | null>;
	additionalFileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
	uploadedImages,
	onImageRemove,
	mainFileInputRef,
	additionalFileInputRef,
}) => {
	return (
		<div
			style={{
				width: '100%',
				maxWidth: 450,
				aspectRatio: '1/1',
				margin: '0 auto',
				padding: 0,
				boxSizing: 'border-box',
				position: 'relative',
			}}
			className="create-listing-images-responsive"
		>
			{/* Spacer to align with Item Details h1 */}
			<div style={{ height: '24px', marginBottom: '16px' }}></div>

			{/* Main Image */}
			{uploadedImages.length > 0 && (
				<div
					style={{
						width: '100%',
						maxWidth: 450,
						aspectRatio: '1/1',
						margin: '0 auto',
						padding: 0,
						boxSizing: 'border-box',
						position: 'relative',
						marginBottom: '16px',
					}}
				>
					<img
						src={uploadedImages[0]}
						alt="Main uploaded item"
						style={{
							width: '100%',
							height: '100%',
							aspectRatio: '1/1',
							maxWidth: 450,
							maxHeight: 450,
							borderRadius: '2px',
							border: '0.5px solid var(--color-foreground-2)',
							objectFit: 'cover',
							display: 'block',
							boxSizing: 'border-box',
							margin: '0 auto',
						}}
					/>
					<Button
						type="text"
						danger
						icon={<CloseOutlined />}
						aria-label="Remove main image"
						onClick={() => onImageRemove(uploadedImages[0])}
						className="remove-image-button"
						style={{
							position: 'absolute',
							top: '8px',
							right: '8px',
							background: 'white',
							border: '1px solid #d9d9d9',
							borderRadius: '4px',
							zIndex: 10,
							boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
							width: '32px',
							height: '32px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							opacity: 1,
						}}
					/>
				</div>
			)}

			{/* Image Thumbnails */}
			{uploadedImages.length > 0 ? (
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '8px',
						justifyContent: 'flex-start',
						marginTop: uploadedImages.length > 1 ? '16px' : '0',
						maxWidth: '450px',
						margin: '0 auto',
					}}
				>
					{uploadedImages.slice(1).map((image, index) => (
						<Button
							key={image}
							type="text"
							style={{
								width: '80px',
								height: '80px',
								borderRadius: '4px',
								border: '1px solid var(--color-foreground-2)',
								overflow: 'hidden',
								position: 'relative',
								padding: 0,
								margin: 0,
								flexShrink: 0,
							}}
							onClick={() => {
								const newImages = [...uploadedImages];
								const clickedImage = newImages.splice(index + 1, 1)[0];
								newImages.unshift(clickedImage);
								// parent state should be updated by owner; kept here to preserve layout
							}}
						>
							<img
								src={image}
								alt={`Thumbnail ${index + 2}`}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
							<Button
								type="text"
								danger
								icon={<CloseOutlined />}
								aria-label="Remove image"
								onClick={(e) => {
									e.stopPropagation();
									onImageRemove(image);
								}}
								className="remove-thumbnail-button"
								style={{
									position: 'absolute',
									top: '2px',
									right: '2px',
									background: 'white',
									border: '1px solid #d9d9d9',
									borderRadius: '2px',
									zIndex: 10,
									boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
									width: '20px',
									height: '20px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									opacity: 1,
									fontSize: '10px',
								}}
							/>
						</Button>
					))}

					{/* Upload Thumbnail */}
					{uploadedImages.length < 5 && (
						<button
							type="button"
							style={{
								width: '80px',
								height: '80px',
								border: '2px dashed var(--color-foreground-2)',
								borderRadius: '4px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								backgroundColor: 'var(--color-background-2)',
								padding: 0,
								flexShrink: 0,
							}}
							onClick={() => additionalFileInputRef.current?.click()}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									additionalFileInputRef.current?.click();
								}
							}}
							onMouseEnter={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor =
									'var(--color-secondary)';
								(e.currentTarget as HTMLElement).style.backgroundColor =
									'rgba(63, 129, 118, 0.05)';
							}}
							onMouseLeave={(e) => {
								(e.currentTarget as HTMLElement).style.borderColor =
									'var(--color-foreground-2)';
								(e.currentTarget as HTMLElement).style.backgroundColor =
									'var(--color-background-2)';
							}}
							aria-label="Upload additional image"
						>
							<PlusOutlined
								style={{
									fontSize: '24px',
									color: 'var(--color-foreground-2)',
								}}
							/>
						</button>
					)}
				</div>
			) : (
				/* Upload area when no images */
				<div
					style={{
						width: '100%',
						maxWidth: 450,
						aspectRatio: '1/1',
						margin: '0 auto',
						padding: 0,
						boxSizing: 'border-box',
						position: 'relative',
						marginTop: '16px',
					}}
				>
					<button
						type="button"
						style={{
							width: '100%',
							height: '100%',
							border: '2px dashed var(--color-foreground-2)',
							borderRadius: '4px',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							backgroundColor: 'var(--color-background-2)',
							padding: 0,
						}}
						onClick={() => mainFileInputRef.current?.click()}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								mainFileInputRef.current?.click();
							}
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								'var(--color-secondary)';
							(e.currentTarget as HTMLElement).style.backgroundColor =
								'rgba(63, 129, 118, 0.05)';
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLElement).style.borderColor =
								'var(--color-foreground-2)';
							(e.currentTarget as HTMLElement).style.backgroundColor =
								'var(--color-background-2)';
						}}
						aria-label="Upload image"
					>
						<PlusOutlined
							style={{
								fontSize: '48px',
								color: 'var(--color-foreground-2)',
							}}
						/>
						<div
							style={{
								marginTop: '16px',
								color: 'var(--color-foreground-2)',
								fontSize: '16px',
								fontWeight: '500',
							}}
						>
							Click to upload images
						</div>
					</button>
				</div>
			)}
		</div>
	);
};

export default ImageGallery;
