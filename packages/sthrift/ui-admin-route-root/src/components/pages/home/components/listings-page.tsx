import { ListingsPage as SharedListingsPage } from '@sthrift/ui-shared';
import type { ItemListing } from '../../../../generated.tsx';
import { HeroSectionContainer } from './hero-section.container.tsx';
import type { UIItemListing } from '@sthrift/ui-shared';
interface ListingsPageProps {
	isAuthenticated: boolean;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onSearch: (query: string) => void;
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	listings: ItemListing[];
	currentPage: number;
	pageSize: number;
	totalListings: number;
	onListingClick: (listing: UIItemListing) => void;
	onPageChange: (page: number) => void;
}

export const ListingsPage: React.FC<Readonly<ListingsPageProps>> = (props) => {
	return (
		<SharedListingsPage
			{...props}
			listings={props.listings as UIItemListing[]}
			heroSection={
				<HeroSectionContainer
					searchValue={props.searchQuery}
					onSearchChange={props.onSearchChange}
					onSearch={props.onSearch}
				/>
			}
		/>
	);
};
