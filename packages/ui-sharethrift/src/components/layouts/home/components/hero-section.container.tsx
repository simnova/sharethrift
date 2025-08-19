// import { useQuery } from '@apollo/client';
// import GET_HERO_CONTENT from './hero-section.container.graphql';
import { HeroSection } from './hero-section';

interface HeroSectionContainerProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (query: string) => void;
}

export function HeroSectionContainer({ 
  searchValue = '', 
  onSearchChange, 
  onSearch 
}: HeroSectionContainerProps) {
  // TODO: Add any business logic here when needed
  // For now, this is a simple pass-through container
  
  return (
    <HeroSection
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onSearch={onSearch}
    />
  );
}