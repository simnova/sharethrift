import { Button } from 'antd';
import { EnvironmentFilled, PlusOutlined } from '@ant-design/icons';
import { HeroSectionContainer } from './hero-section.container.tsx';
import { CategoryFilterContainer } from './category-filter.container.tsx';
import { SearchBar, ListingsGrid } from '@sthrift/ui-components';
import styles from './listings-page.module.css';

export interface ItemListing {
	_id: string;
	sharer: string; // User reference
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state?:
		| 'Published'
		| 'Paused'
		| 'Cancelled'
		| 'Drafted'
		| 'Expired'
		| 'Blocked'
		| 'Appeal Requested';
	updatedAt?: Date;
	createdAt?: Date;
	sharingHistory?: string[];
	reports?: number;
	images?: string[];
}

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
	onListingClick: (listing: ItemListing) => void;
	onPageChange: (page: number) => void;
	onCreateListingClick: () => void;
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
	onCreateListingClick,
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
				id="listings-content"
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
						{/* Create listing button */}
						<Button
							type="primary"
							className={styles['createListing']}
							onClick={onCreateListingClick}
						>
							Create a Listing
						</Button>
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
						listings={listings}
						onListingClick={onListingClick}
						currentPage={currentPage}
						pageSize={pageSize}
						total={totalListings}
						onPageChange={onPageChange}
					/>
				</div>
			</div>

			{/* Mobile Create Listing Overlay Button */}
			<button
				type="button"
				className="mobile-create-overlay"
				onClick={onCreateListingClick}
				style={{
					position: 'fixed',
					bottom: '20px',
					right: '20px',
					width: '56px',
					height: '56px',
					borderRadius: '50%',
					backgroundColor: 'var(--color-primary, #1890ff)',
					border: 'none',
					color: 'white',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
					transition: 'all 0.3s ease',
					zIndex: 1000,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor =
						'var(--color-secondary, #3F8176)';
					e.currentTarget.style.transform = 'scale(1.1)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor =
						'var(--color-primary, #1890ff)';
					e.currentTarget.style.transform = 'scale(1)';
				}}
			>
				<PlusOutlined style={{ fontSize: '24px' }} />
			</button>
		</div>
	);
}
