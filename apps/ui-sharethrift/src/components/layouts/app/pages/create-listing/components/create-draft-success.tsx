import { Modal, Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './modals.module.css';
import '@sthrift/ui-components/src/styles/theme.css';

interface SuccessDraftProps {
	visible: boolean;
	loading?: boolean;
	onClose?: () => void;
	onViewDraft?: () => void;
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
							Saving your draft
						</div>
					</>
				) : (
					<>
						<div
							className="title36"
							style={{ marginTop: 16, textAlign: 'center' }}
						>
							Draft saved!
						</div>
						<p style={{ marginTop: 8, textAlign: 'center' }}>
							Your listing draft has been saved. You can continue editing it later.
						</p>
						<div className={styles['actions']}>
							<Button
								type="primary"
								className="primaryButton"
								onClick={props.onViewDraft || props.onClose}
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