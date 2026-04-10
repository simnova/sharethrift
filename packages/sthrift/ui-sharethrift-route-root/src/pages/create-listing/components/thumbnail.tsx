import styles from './thumbnail.module.css';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const Thumbnail: React.FC<{
	src: string;
	onRemove: () => void;
}> = ({
	src,
	onRemove,
}) => (
	<div className={styles['wrapper']}>
		<img src={src} className={styles['img']} alt="" />
		<Button
			type="text"
			danger
			icon={<CloseOutlined />}
			onClick={(e) => {
				e.stopPropagation();
				onRemove();
			}}
			className={styles['remove']}
		/>
	</div>
);
