import { HeroSection } from './hero-section.tsx';

interface HeroSectionContainerProps {
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onSearch?: (query: string) => void;
}

export function HeroSectionContainer({
	searchValue = '',
	onSearchChange,
	onSearch,
}: HeroSectionContainerProps) {
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
