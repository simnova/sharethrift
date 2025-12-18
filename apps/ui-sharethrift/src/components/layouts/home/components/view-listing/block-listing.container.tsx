import { useMutation } from '@apollo/client/react';
import { message } from 'antd';
import {
	BlockListingContainerBlockListingDocument,
	BlockListingContainerUnblockListingDocument,
	ViewListingDocument,
} from '../../../../../generated.tsx';
import { BlockListingModal } from './block-listing-modal.tsx';
import { UnblockListingModal } from './unblock-listing-modal.tsx';
import { useState } from 'react';
import { Button } from 'antd';

interface BlockListingContainerProps {
	listingId: string;
	listingTitle: string;
	isBlocked: boolean;
	sharerId?: string;
}

interface BlockListingButtonProps {
	listingId: string;
	listingTitle: string;
	isBlocked: boolean;
	sharerId?: string;
	renderModals?: boolean;
}

export const BlockListingButton: React.FC<BlockListingButtonProps> = ({
	listingId,
	listingTitle,
	isBlocked,
	sharerId = 'Unknown',
	renderModals = true,
}) => {
	const [blockModalVisible, setBlockModalVisible] = useState(false);
	const [unblockModalVisible, setUnblockModalVisible] = useState(false);

	const [blockListing, { loading: blockLoading }] = useMutation(
		BlockListingContainerBlockListingDocument,
		{
			onCompleted: () => {
				message.success('Listing blocked successfully');
			},
			onError: (error) => {
				message.error(`Failed to block listing: ${error.message}`);
			},
			refetchQueries: [
				{
					query: ViewListingDocument,
					variables: { id: listingId },
				},
			],
		},
	);

	const [unblockListing, { loading: unblockLoading }] = useMutation(
		BlockListingContainerUnblockListingDocument,
		{
			onCompleted: () => {
				message.success('Listing unblocked successfully');
			},
			onError: (error) => {
				message.error(`Failed to unblock listing: ${error.message}`);
			},
			refetchQueries: [
				{
					query: ViewListingDocument,
					variables: { id: listingId },
				},
			],
		},
	);

	const handleBlockConfirm = async () => {
		await blockListing({ variables: { id: listingId } });
		setBlockModalVisible(false);
	};

	const handleUnblockConfirm = async () => {
		await unblockListing({ variables: { id: listingId } });
		setUnblockModalVisible(false);
	};

	return (
		<>
			{isBlocked ? (
				<Button
                    className="secondaryButton"
					type="default"
					onClick={() => setUnblockModalVisible(true)}
					loading={unblockLoading}
				>
					Unblock Listing
				</Button>
			) : (
				<Button
					type="primary"
                    danger
					onClick={() => setBlockModalVisible(true)}
					loading={blockLoading}
				>
					Block Listing
				</Button>
			)}
			{renderModals && (
				<>
					<BlockListingModal
						visible={blockModalVisible}
						listingTitle={listingTitle}
						onConfirm={handleBlockConfirm}
						onCancel={() => setBlockModalVisible(false)}
						loading={blockLoading}
					/>
					<UnblockListingModal
						visible={unblockModalVisible}
						listingTitle={listingTitle}
						listingSharer={sharerId}
						onConfirm={handleUnblockConfirm}
						onCancel={() => setUnblockModalVisible(false)}
						loading={unblockLoading}
					/>
				</>
			)}
		</>
	);
};

export const BlockListingContainer: React.FC<BlockListingContainerProps> = ({
	listingId,
	listingTitle,
	isBlocked,
	sharerId = 'Unknown',
}) => {
	return (
		<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
			<BlockListingButton
				listingId={listingId}
				listingTitle={listingTitle}
				isBlocked={isBlocked}
				sharerId={sharerId}
				renderModals={true}
			/>
		</div>
	);
};
