import type React from 'react';
import { Layout, Button } from 'antd';
import styles from './index.module.css';
import '../../styles/theme.css';
import logoIcon from '../../assets/logo/logo-icon.svg';

export interface HeaderProps {
	isAuthenticated: boolean;
	onLogin?: () => void;
	onSignUp?: () => void;
	onLogout?: () => void;
	onCreateListing?: () => void;
}

const { Header: AntHeader } = Layout;

export const Header: React.FC<HeaderProps> = ({
	isAuthenticated,
	onLogin,
	onSignUp,
	onLogout,
	onCreateListing,
}) => {
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
						<Button
							type="link"
							className={styles.authButton ?? ''}
							onClick={onLogin}
						>
							Log In
						</Button>
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
