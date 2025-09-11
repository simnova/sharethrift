import { Modal, Button, Spin } from 'antd';
import styles from './screens.module.css';
import '@sthrift/ui-sharethrift-components/src/styles/theme.css';
import confettiImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/confetti.png';

export const SuccessPublished: React.FC<{
	visible: boolean;
	loading?: boolean;
	onClose?: () => void;
}> = ({ visible, loading, onClose }) => {
	return (
		<Modal
			open={visible}
			footer={null}
			closable={false}
			centered
			className={styles['modalRoot']}
		>
			<div className={styles['content']}>
				{loading ? (
					<>
						<Spin size="large" />
						<div
							className="title36"
							style={{ marginTop: 16, textAlign: 'center' }}
						>
							Publishing your listing
						</div>
					</>
				) : (
					<>
						<img src={confettiImg} alt="confetti" className={styles['image']} />
						<div
							className="title36"
							style={{ marginTop: 16, textAlign: 'center' }}
						>
							Your listing is live!
						</div>
						<p style={{ marginTop: 8, textAlign: 'center' }}>
							Congratulations — your item has been published and is visible to
							others.
						</p>
						<div className={styles.actions}>
							<Button
								type="primary"
								className="primaryButton"
								onClick={onClose}
							>
								View Listing
							</Button>
							<Button className="secondaryButton" onClick={onClose}>
								Back to Listings
							</Button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
};
