import { Card, Button, Tag } from 'antd';
import type { AdminUserData } from './admin-users-table.types.ts';

export interface AdminUsersCardProps {
	user: AdminUserData;
	onAction: (action: 'block' | 'unblock' | 'view-profile' | 'view-report') => void;
}

export function AdminUsersCard({ user, onAction }: AdminUsersCardProps) {
	return (
		<Card
			style={{
				marginBottom: 16,
				border: '1px solid var(--color-foreground-2)',
			}}
		>
			<div style={{ marginBottom: 12 }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<strong style={{ fontSize: 16 }}>{user.username || 'N/A'}</strong>
					<Tag color={user.status === 'Blocked' ? 'red' : 'green'}>
						{user.status}
					</Tag>
				</div>
			</div>

			<div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
				<div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
				<div><strong>Created:</strong> {new Date(user.accountCreated).toLocaleDateString()}</div>
				{user.email && <div><strong>Email:</strong> {user.email}</div>}
			</div>

			<div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
				<Button
					type="link"
					size="small"
					onClick={() => onAction('view-profile')}
					style={{ padding: 0 }}
				>
					View Profile
				</Button>
				
				{user.reportCount && user.reportCount > 0 && (
					<Button
						type="link"
						size="small"
						onClick={() => onAction('view-report')}
						style={{ padding: 0 }}
					>
						View Report ({user.reportCount})
					</Button>
				)}

				{user.status === 'Blocked' ? (
					<Button
						type="link"
						size="small"
						onClick={() => onAction('unblock')}
						style={{ padding: 0 }}
					>
						Unblock
					</Button>
				) : (
					<Button
						type="link"
						size="small"
						danger
						onClick={() => onAction('block')}
						style={{ padding: 0 }}
					>
						Block
					</Button>
				)}
			</div>
		</Card>
	);
}
