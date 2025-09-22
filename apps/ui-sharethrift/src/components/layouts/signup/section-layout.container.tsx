import type { FC } from "react";
import { SectionLayout } from "./section-layout";

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface SectionLayoutContainerProps {}

export const SectionLayoutContainer: FC<SectionLayoutContainerProps> = (_props) => {
  return <SectionLayout />;
};
