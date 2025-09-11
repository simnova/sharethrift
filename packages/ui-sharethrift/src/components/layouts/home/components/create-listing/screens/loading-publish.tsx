import { Modal, Spin, Button } from 'antd';
import styles from './screens.module.css';
import '@sthrift/ui-sharethrift-components/src/styles/theme.css';
import hammockImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/hammock.png';

export const LoadingPublish: React.FC<{
	visible: boolean;
	onCancel?: () => void;
}> = ({ visible, onCancel }) => {
	return (
		<Modal
			open={visible}
			footer={null}
			closable={false}
			centered
			className={styles['modalRoot']}
		>
			<div className={styles['content']}>
				<img src={hammockImg} alt="hammock" className={styles['image']} />
				<div style={{ marginTop: 24 }}>
					<Spin size="large" />
				</div>
				<div className="title36" style={{ marginTop: 16, textAlign: 'center' }}>
					Publishing your listing
				</div>
				<p className="p" style={{ marginTop: 8, textAlign: 'center' }}>
					Hang tight — we are publishing your listing. This may take a few
					moments.
				</p>
				<div style={{ marginTop: 20 }}>
					<Button onClick={onCancel} className="secondaryButton">
						Cancel
					</Button>
				</div>
			</div>
		</Modal>
	);
};
