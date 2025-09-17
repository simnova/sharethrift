import { Modal, Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './modals.module.css';
import '@sthrift/ui-sharethrift-components/src/styles/theme.css';
import listImg from '@sthrift/ui-sharethrift-components/src/assets/item-images/list.png';

interface SuccessDraftProps {
	visible: boolean;
	loading?: boolean;
	onClose?: () => void;
}

export const SuccessDraft: React.FC<SuccessDraftProps> = (props) => {
	const navigate = useNavigate();
	return (
		<Modal
			open={props.visible}
			footer={null}
			closable={false}
			centered
			className={styles['modalRoot']}
		>
			<div className={styles['content']}>
				{props.loading ? (
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
						<div className={styles.actions}>
							<Button
								type="primary"
								className="primaryButton"
								onClick={props.onClose}
							>
								View Draft
							</Button>
							<Button
								className="secondaryButton"
								onClick={() => {
									navigate('/');
								}}
							>
								Back to Home
							</Button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
};
