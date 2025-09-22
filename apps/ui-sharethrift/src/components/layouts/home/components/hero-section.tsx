import React from "react";
import styles from "./hero-section.module.css";
import { SearchBar } from "@sthrift/ui-components";
import heroImg from "@sthrift/ui-components/src/assets/hero/hero.png";
import heroImgSmall from "@sthrift/ui-components/src/assets/hero/hero-small.png";

export interface HeroSectionProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  searchValue = "",
}) => {
  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  return (
    <div className={styles.heroContainer}>
      <picture className={styles.heroImage}>
        <source srcSet={heroImgSmall} media="(max-width: 768px)" />
        <source srcSet={heroImg} media="(min-width: 769px)" />
        <img src={heroImg} alt="Hero background" />
      </picture>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Wherever you are,
          <br />
          borrow what you need.
        </h1>
        <div className={styles.searchContainer}>
          <SearchBar
            searchValue={searchValue}
            onSearchChange={handleSearch}
            onSearch={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};
