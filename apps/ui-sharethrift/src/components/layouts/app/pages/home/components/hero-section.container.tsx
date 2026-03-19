import { HeroSection } from './hero-section.tsx';

interface HeroSectionContainerProps {
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onSearch?: () => void;
}

export const HeroSectionContainer: React.FC<HeroSectionContainerProps> = ({
	searchValue = '',
	onSearchChange,
	onSearch,
}) => {
	// Add any logic here when needed
	// For now, this is a simple pass-through container

	return (
		<HeroSection
			searchValue={searchValue}
			onSearchChange={onSearchChange}
			onSearch={onSearch}
		/>
	);
}
