import { Modal, Button, Spin } from 'antd';
import styles from './screens.module.css';
import '@sthrift/ui-sharethrift-components/src/styles/theme.css';
import listImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/list.png';

export const SuccessDraft: React.FC<{
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
							Saving draft
						</div>
					</>
				) : (
					<>
						<img src={listImg} alt="list" className={styles['image']} />
						<div
							className="title36"
							style={{ marginTop: 16, textAlign: 'center' }}
						>
							Draft saved
						</div>
						<p style={{ marginTop: 8, textAlign: 'center' }}>
							Your draft has been saved. You can publish it anytime from your
							drafts.
						</p>
						<div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
							<Button
								type="primary"
								className="primaryButton"
								onClick={onClose}
							>
								View Draft
							</Button>
							<Button className="secondaryButton" onClick={onClose}>
								Back
							</Button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
};
