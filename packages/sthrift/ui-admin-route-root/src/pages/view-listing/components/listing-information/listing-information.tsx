import { ListingInformation as SharedListingInformation } from '@sthrift/ui-shared';
import type { ItemListing } from '../../../../generated.tsx';

interface ListingInformationProps {
	listing: ItemListing;
	className?: string;
}

export const ListingInformation: React.FC<ListingInformationProps> = ({
	listing,
	className = '',
}) => {
	return (
		<SharedListingInformation
			listing={listing}
			className={className}
			actionSlot={
				<div
					style={{
						padding: '16px 18px',
						borderRadius: '12px',
						backgroundColor: 'rgba(232, 229, 220, 0.55)',
						border: '1px solid rgba(92, 138, 138, 0.25)',
					}}
				>
					<div
						style={{
							fontWeight: 700,
							marginBottom: 6,
							color: 'var(--color-message-text)',
						}}
					>
						Admin view only
					</div>
					<div
						style={{
							fontSize: '14px',
							lineHeight: 1.5,
							color: 'var(--color-message-text)',
						}}
					>
						Reservations are disabled in the admin portal. Admins can review
						listing details here, but borrower and sharer actions stay in the
						main user portal.
					</div>
				</div>
			}
		/>
	);
};
