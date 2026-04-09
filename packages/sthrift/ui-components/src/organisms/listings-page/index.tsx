import { EnvironmentFilled, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ListingsGrid } from '../../organisms/listings-grid/index.tsx';
import { SearchBar } from '../../molecules/search-bar/index.tsx';
import { CategoryFilterContainer } from '../../molecules/category-filter/category-filter.container.tsx';
import type { UIItemListing } from '../../organisms/listings-grid/index.tsx';
import styles from './listings-page.module.css';

interface ListingsPageProps {
	isAuthenticated: boolean;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onSearch: (query: string) => void;
	selectedCategory: string;
	onCategoryChange: (category: string) => void;
	listings: UIItemListing[];
	currentPage: number;
	pageSize: number;
	totalListings: number;
	onListingClick: (listing: UIItemListing) => void;
	onPageChange: (page: number) => void;
	onCreateListingClick?: () => void;
	heroSection?: React.ReactNode;
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
	heroSection,
}) => {
	return (
		<div>
			{/* Hero section */}
			{!isAuthenticated && heroSection}
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
						{/* Create listing button - only shown when callback provided */}
						{onCreateListingClick && (
							<Button
								type="primary"
								className={styles['createListing']}
								onClick={onCreateListingClick}
							>
								Create a Listing
							</Button>
						)}
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

			{/* Mobile Create Listing Overlay Button - only shown when callback provided */}
			{onCreateListingClick && (
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
			)}
		</div>
	);
};
