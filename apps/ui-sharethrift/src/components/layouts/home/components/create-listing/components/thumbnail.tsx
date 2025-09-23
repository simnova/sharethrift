import styles from './thumbnail.module.css';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const Thumbnail = ({
	src,
	onRemove,
}: {
	src: string;
	onRemove: () => void;
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
