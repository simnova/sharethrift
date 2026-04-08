import { EnvironmentFilled } from '@ant-design/icons';
import { ListingsGrid, SearchBar } from '@sthrift/ui-components';
import type { ItemListing } from '../../../../../../generated.tsx';
import { CategoryFilterContainer } from './category-filter.container.tsx';
import { HeroSectionContainer } from './hero-section.container.tsx';
import styles from './listings-page.module.css';
import type { UIItemListing } from '@sthrift/ui-components';
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

export const ListingsPage: React.FC<Readonly<ListingsPageProps>> = ({
	isAuthenticated,
	searchQuery,
	onSearchChange,
	onSearch,
	selectedCategory,
	onCategoryChange,
	listings,
	currentPage,
	pageSize,
	totalListings,
	onListingClick,
	onPageChange,
}) => {
	return (
		<div>
			{/* Hero section */}
			{!isAuthenticated && (
				<HeroSectionContainer
					searchValue={searchQuery}
					onSearchChange={onSearchChange}
					onSearch={onSearch}
				/>
			)}
			<div
				className={styles['listingsPage']}
				style={{ padding: isAuthenticated ? '36px' : '100px' }}
			>
				<div
					className={styles['listingsHeader']}
					style={{ gap: isAuthenticated ? '36px 0' : '24px 0' }}
				>
					<div
						className={`${styles['searchBar']} ${
							isAuthenticated ? '' : styles['hideOnDesktop']
						}`}
					>
						{/* Search */}
						<SearchBar
							searchValue={searchQuery}
							onSearchChange={onSearchChange}
							onSearch={onSearch}
						/>
					</div>

					{!isAuthenticated && <h1 style={{ margin: '0' }}>Today's Picks</h1>}

					<div className={styles['filterBar']}>
						{/* Category filter */}
						<CategoryFilterContainer
							selectedCategory={selectedCategory}
							onCategoryChange={onCategoryChange}
						/>
						{/* Location filter placeholder - implement advanced filter later */}
						<span
							style={{
								fontSize: '14px',
								fontWeight: '600',
								color: 'var(--color-tertiary)',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<EnvironmentFilled
								style={{ fontSize: '18px', marginRight: '8px' }}
							/>
							Philadelphia, PA · 10 mi
						</span>
					</div>
				</div>

				{/* Listings grid */}
				<div className={styles['listingsGridWrapper']}>
					<ListingsGrid
						listings={listings as UIItemListing[]}
						onListingClick={onListingClick}
						currentPage={currentPage}
						pageSize={pageSize}
						total={totalListings}
						onPageChange={onPageChange}
					/>
				</div>
			</div>
		</div>
	);
};
