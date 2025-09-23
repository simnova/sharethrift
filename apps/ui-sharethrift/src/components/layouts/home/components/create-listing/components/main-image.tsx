import styles from './main-image.module.css';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export function MainImage({
	src,
	count,
	onRemove,
}: {
	src: string;
	count: number;
	onRemove: () => void;
}) {
	return (
		<div className={styles['container']}>
			<img src={src} alt="" className={styles['image']} />
			<div className={styles['caption']}>{count} / 5</div>
			<Button
				type="text"
				danger
				icon={<CloseOutlined />}
				onClick={onRemove}
				className={styles['removeButton']}
			/>
		</div>
	);
}
