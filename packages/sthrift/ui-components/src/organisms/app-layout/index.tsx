import type React from 'react';
import { Layout } from 'antd';
import { Header } from '../../molecules/header/index.js';
import { Navigation } from '../../molecules/navigation/index.js';
import { Footer } from '../../molecules/footer/index.js';
import styles from './index.module.css';

export interface AppLayoutProps {
	isAuthenticated: boolean;
	onLogin?: () => void;
	onLogout?: () => void;
	onSignUp?: () => void;
	onCreateListing?: () => void;
	onNavigate?: (route: string) => void;
	selectedKey?: string;
	children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
	isAuthenticated,
	onLogin,
	onLogout,
	onSignUp,
	onCreateListing,
	onNavigate,
	selectedKey,
	children,
}) => {
	return (
		<Layout className={styles.appLayout}>
			<Header
				isAuthenticated={isAuthenticated}
				onLogin={
					onLogin ??
					(() => {
						/* intentionally empty for layout */
					})
				}
				onSignUp={
					onSignUp ??
					(() => {
						/* intentionally empty for layout */
					})
				}
				onLogout={
					onLogout ??
					(() => {
						/* intentionally empty for layout */
					})
				}
				onCreateListing={
					onCreateListing ??
					(() => {
						/* intentionally empty for layout */
					})
				}
			/>
			<div className={styles.bodyWrapper}>
				<Navigation
					isAuthenticated={isAuthenticated}
					onLogout={
						onLogout ??
						(() => {
							/* intentionally empty for layout */
						})
					}
					onNavigate={
						onNavigate ??
						(() => {
							/* intentionally empty for layout */
						})
					}
					selectedKey={selectedKey ?? ''}
				/>
				<main className={styles.content}>{children}</main>
			</div>
			<Footer />
		</Layout>
	);
};
