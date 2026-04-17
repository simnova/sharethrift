import { Button, Layout } from 'antd';
import { Link } from 'react-router-dom';
import logoIcon from '@sthrift/ui-shared/src/assets/logo/logo-icon.svg';
import '@sthrift/ui-shared/src/styles/theme.css';
import styles from './admin-header.module.css';

interface AdminHeaderProps {
	isAuthenticated: boolean;
	onLogout?: () => void;
}

const { Header: AntHeader } = Layout;

export const AdminHeader: React.FC<AdminHeaderProps> = ({
	isAuthenticated,
	onLogout,
}) => {
	return (
		<AntHeader className={styles['header']}>
			<Link to="/" className={styles['brand']}>
				<img src={logoIcon} alt="Sharethrift Logo" className={styles['logo']} />
				<span className={styles['brandTextGroup']}>
					<span className={styles['brandName']}>sharethrift</span>
					<span className={styles['portalPill']}>Admin Portal</span>
				</span>
			</Link>
			<nav className={styles['actions']}>
				{isAuthenticated ? (
					<Button
						type="link"
						className={styles['authButton']}
						onClick={onLogout}
					>
						Log Out
					</Button>
				) : null}
			</nav>
		</AntHeader>
	);
};
