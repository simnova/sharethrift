import { ArrowLeftOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@apollo/client/react';
import {
	Button,
	Card,
	Descriptions,
	Image,
	message,
	Popconfirm,
	Space,
	Spin,
	Tag,
} from 'antd';
import type { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	AdminListingsTableContainerAdminListingsDocument,
	AdminListingsTableContainerDeleteListingDocument,
	AdminListingsTableContainerUnblockListingDocument,
} from '../../../../../../generated.tsx';

export default function AdminViewListing(): ReactElement {
	const location = useLocation();
	const navigate = useNavigate();

	// For testing, parse listingId from pathname
	const listingId = location.pathname.split('/').pop() || '';

	// Fetch all admin listings to find the one we're viewing
	const { data, loading, refetch } = useQuery(
		AdminListingsTableContainerAdminListingsDocument,
		{
			variables: {
				page: 1,
				pageSize: 100, // Large enough to find the listing
				statusFilters: ['Blocked', 'Active'],
			},
		},
	);

	const [unblockListingMutation] = useMutation(
		AdminListingsTableContainerUnblockListingDocument,
	);

	const [deleteListingMutation] = useMutation(
		AdminListingsTableContainerDeleteListingDocument,
		{
			onCompleted: (data) => {
				if (data.deleteItemListing?.status?.success) {
					message.success('Listing deleted');
					handleBack();
				} else {
					message.error(
						`Failed to delete listing: ${data.deleteItemListing?.status?.errorMessage ?? 'Unknown error'}`,
					);
				}
			},
			onError: (error) => {
				message.error(`Failed to delete listing: ${error.message}`);
			},
		},
	);
	const listing = data?.adminListings?.items?.find(
		(item) => item.id === listingId,
	);

	const handleBack = () => {
		globalThis.sessionStorage.removeItem('adminContext');
		navigate('/account/admin-dashboard?tab=listings');
	};

	const handleUnblock = async () => {
		if (!listing) return;
		try {
			await unblockListingMutation({ variables: { id: listing.id } });
			message.success('Listing unblocked');
			await refetch();
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : String(e);
			message.error(msg);
		}
	};

	const handleDelete = async () => {
		if (!listing) return;
		try {
			// onCompleted and onError handlers will show messages and navigate
			await deleteListingMutation({ variables: { id: listing.id } });
		} catch (_e: unknown) {
			// Error is handled by onError, but catch to prevent unhandled rejection
		}
	};
	if (loading) {
		return (
			<div style={{ padding: 24, textAlign: 'center' }}>
				<Spin size="large" />
				<div style={{ marginTop: 16 }}>Loading listing...</div>
			</div>
		);
	}

	if (!listing) {
		return (
			<div style={{ padding: 24 }}>
				<Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
					Back to Admin Dashboard
				</Button>
				<div style={{ marginTop: 24, textAlign: 'center' }}>
					<h2>Listing not found</h2>
					<p>The listing with ID {listingId} could not be found.</p>
				</div>
			</div>
		);
	}

	const getStatusColor = (state?: string) => {
		if (state === 'Blocked') return 'purple';
		return 'green';
	};

	const statusColor = getStatusColor(listing.state ?? undefined);
	const statusLabel =
		listing.state === 'Blocked'
			? 'Blocked'
			: (listing.state ?? 'Unknown');

	return (
		<div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
			<Button
				icon={<ArrowLeftOutlined />}
				onClick={handleBack}
				style={{ marginBottom: 16 }}
			>
				Back to Admin Dashboard
			</Button>

			<Card>
				<div style={{ marginBottom: 16 }}>
					<Tag color="blue">Admin View</Tag>
					<Tag color={statusColor}>{statusLabel}</Tag>
				</div>

				<div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
					{listing.images && listing.images.length > 0 && (
						<Image
							src={listing.images[0]}
							alt={listing.title}
							width={300}
							height={300}
							style={{ objectFit: 'cover', borderRadius: 8 }}
						/>
					)}
					<div style={{ flex: 1 }}>
						<h1 style={{ marginTop: 0 }}>{listing.title}</h1>

						<Descriptions column={1} bordered>
							<Descriptions.Item label="Listing ID">
								{listing.id}
							</Descriptions.Item>
							<Descriptions.Item label="Published At">
								{listing.createdAt
									? new Date(listing.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})
									: 'N/A'}
							</Descriptions.Item>
							<Descriptions.Item label="Reservation Period">
								{listing.sharingPeriodStart && listing.sharingPeriodEnd
									? `${new Date(listing.sharingPeriodStart).toLocaleDateString()} - ${new Date(listing.sharingPeriodEnd).toLocaleDateString()}`
									: 'N/A'}
							</Descriptions.Item>
							<Descriptions.Item label="Status">
								<Tag color={statusColor}>{statusLabel}</Tag>
							</Descriptions.Item>
							<Descriptions.Item label="Pending Requests">
								{/* Field not present on ListingAll; show placeholder */}
								{'-'}
							</Descriptions.Item>
						</Descriptions>
					</div>
				</div>

				<div
					style={{
						marginTop: 24,
						borderTop: '1px solid #f0f0f0',
						paddingTop: 24,
					}}
				>
					<h3>Admin Actions</h3>
					<Space>
						{(listing.state === 'Blocked') && (
							<Button type="primary" onClick={handleUnblock}>
								Unblock Listing
							</Button>
						)}
						<Popconfirm
							title="Remove this listing?"
							description="This action cannot be undone. The listing will be permanently removed."
							onConfirm={handleDelete}
							okText="Remove"
							cancelText="Cancel"
							okButtonProps={{ danger: true }}
						>
							<Button danger>Remove Listing</Button>
						</Popconfirm>
					</Space>
				</div>

				<div
					style={{
						marginTop: 24,
						padding: 16,
						background: '#f5f5f5',
						borderRadius: 4,
					}}
				>
					<h4>Coming Soon</h4>
					<p style={{ marginBottom: 8 }}>
						Additional information will be available here including:
					</p>
					<ul style={{ marginBottom: 0 }}>
						<li>Full listing description and details</li>
						<li>Category and location information</li>
						<li>Lister profile and contact information</li>
						<li>Listing history and timeline</li>
						<li>Reports and appeals (if any)</li>
						<li>Reservation history and active bookings</li>
						<li>Admin action logs and notes</li>
					</ul>
				</div>
			</Card>
		</div>
	);
}
