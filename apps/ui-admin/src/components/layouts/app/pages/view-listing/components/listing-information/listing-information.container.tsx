import type { ItemListing } from '../../../../../../../generated.tsx';
import { ListingInformation } from './listing-information.tsx';


interface ListingInformationContainerProps {
	listing: ItemListing;
	className?: string;
}

export const ListingInformationContainer: React.FC<
	ListingInformationContainerProps
> = ({ listing, className }) => {
	return <ListingInformation listing={listing} className={className} />;
};
