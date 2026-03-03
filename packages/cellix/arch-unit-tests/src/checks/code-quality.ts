export interface CodeQualityConfig {
  tsconfigPath: string;
  domainPaths?: string[];
  uiPaths?: string[];
  servicePaths?: string[];
}

/**
 * Check code quality metrics (cohesion, complexity, etc.)
 * Currently returns empty violations as these checks are aspirational
 */
export function checkCodeQuality(_config: CodeQualityConfig): string[] {
  // Code quality checks are currently disabled/aspirational
  // Return empty violations for now
  return [];
}
