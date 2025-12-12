import type React from 'react';
import { Layout, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import '../../styles/theme.css';
import logoIcon from '../../assets/logo/logo-icon.svg';

interface HeaderProps {
	isAuthenticated: boolean;
	onLogin?: () => void;
	onAdminLogin?: () => void;
	onSignUp?: () => void;
	onLogout?: () => void;
	onCreateListing?: () => void;
}

const { Header: AntHeader } = Layout;

export const Header: React.FC<HeaderProps> = ({
	isAuthenticated,
	onLogin,
	onAdminLogin,
	onSignUp,
	onLogout,
	onCreateListing,
}) => {
	const loginMenuItems: MenuProps['items'] = [
		{
			key: 'personal',
			label: 'Personal Login',
			onClick: onLogin,
		},
		...(onAdminLogin ? [{
			key: 'admin',
			label: 'Admin Login',
			onClick: onAdminLogin,
		}] : []),
	];

	return (
		<AntHeader className={styles.header}>
			<div className={styles.logoSection}>
				<img src={logoIcon} alt="Sharethrift Logo" className={styles.logo} />
				<span className={styles.logoText}>sharethrift</span>
			</div>
			<nav className={styles.authSection}>
				{!isAuthenticated ? (
					<>
						<Button
							type="primary"
							className={styles.createListing ?? ''}
							onClick={onCreateListing}
						>
							Create a Listing
						</Button>
						<Button
							type="link"
							className={styles.authButton ?? ''}
							onClick={onSignUp}
						>
							Sign Up
						</Button>
						<span className={styles.divider}>|</span>
						<Dropdown menu={{ items: loginMenuItems }} trigger={['click']}>
							<Button
								type="link"
								className={styles.authButton ?? ''}
							>
								Log In <DownOutlined />
							</Button>
						</Dropdown>
					</>
				) : (
					<Button
						type="link"
						className={styles.authButton ?? ''}
						onClick={onLogout}
					>
						Log Out
					</Button>
				)}
			</nav>
		</AntHeader>
	);
};
