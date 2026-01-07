import { Button, Popconfirm } from 'antd';

import type { HomeAllListingsTableContainerListingFieldsFragment } from '../../../../../generated.tsx';

function getActionButtons(
	record: HomeAllListingsTableContainerListingFieldsFragment,
	onAction: (action: string, listingId: string) => void,
): React.ReactNode[] {
	const status = record.state ?? 'Unknown';

	const buttons: React.ReactNode[] = [];

	const conditionalButtons: React.ReactNode[] = [];
	if (status === 'Active' || status === 'Reserved') {
		conditionalButtons.push(
			<Button
				key="pause"
				type="link"
				size="small"
				onClick={() => onAction('pause', record.id)}
			>
				Pause
			</Button>,
		);
	}
	if (status === 'Paused' || status === 'Expired') {
		conditionalButtons.push(
			<Button
				key="reinstate"
				type="link"
				size="small"
				onClick={() => onAction('reinstate', record.id)}
			>
				Reinstate
			</Button>,
		);
	}
	if (status === 'Blocked') {
		conditionalButtons.push(
			<Popconfirm
				key="appeal"
				title="Appeal this listing?"
				description="Are you sure you want to appeal the block on this listing?"
				onConfirm={() => onAction('appeal', record.id)}
				okText="Yes"
				cancelText="No"
			>
				<Button type="link" size="small">
					Appeal
				</Button>
			</Popconfirm>,
		);
	}
	if (status === 'Draft') {
		conditionalButtons.push(
			<Button
				key="publish"
				type="link"
				size="small"
				onClick={() => onAction('publish', record.id)}
			>
				Publish
			</Button>,
		);
	}
	if (status === 'Active' || status === 'Paused') {
		conditionalButtons.push(
			<Popconfirm
				key="cancel"
				title="Cancel this listing?"
				description="Are you sure you want to cancel this listing? It will be removed from search results and marked as inactive."
				onConfirm={() => onAction('cancel', record.id)}
				okText="Yes"
				cancelText="No"
			>
				<Button type="link" size="small" danger>
					Cancel
				</Button>
			</Popconfirm>,
		);
	}

	const alwaysButtons: React.ReactNode[] = [
		<Button
			key="edit"
			type="link"
			size="small"
			onClick={() => onAction('edit', record.id)}
		>
			Edit
		</Button>,
		<Popconfirm
			key="delete"
			title="Delete this listing?"
			description="Are you sure you want to delete this listing? This action cannot be undone."
			onConfirm={() => onAction('delete', record.id)}
			okText="Yes"
			cancelText="No"
		>
			<Button type="link" size="small" danger>
				Delete
			</Button>
		</Popconfirm>,
	];

	buttons.push(...conditionalButtons, ...alwaysButtons);

	return buttons;
}

export function AllListingsTableActions({
	record,
	onAction,
}: Readonly<{
	record: HomeAllListingsTableContainerListingFieldsFragment;
	onAction: (action: string, listingId: string) => void;
}>): React.ReactNode {
	const actions = getActionButtons(record, onAction);

	// Ensure at least 3 slots for alignment (first, middle, last)
	const minActions = 3;
	const paddedActions = [
		...actions,
		...new Array(Math.max(0, minActions - actions.length)).fill(null),
	];

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%',
				minWidth: 220,
				gap: 0,
			}}
		>
			{paddedActions.map((btn, idx) => {
				let justifyContent: React.CSSProperties['justifyContent'] = 'center';
				if (idx === 0) {
					justifyContent = 'flex-start';
				} else if (idx === paddedActions.length - 1) {
					justifyContent = 'flex-end';
				}

				return (
					<div
						key={(btn as { key?: React.Key } | null)?.key || idx}
						style={{
							flex: 1,
							display: 'flex',
							justifyContent,
							minWidth: 60,
							maxWidth: 100,
						}}
					>
						{btn}
					</div>
				);
			})}
		</div>
	);
}
