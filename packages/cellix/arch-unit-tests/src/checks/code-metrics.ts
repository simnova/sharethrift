export interface CodeMetricsConfig {
  tsconfigPath: string;
  sourcePaths: string[];
  maxLinesOfCode?: number;    // default: 1000
  maxStatements?: number;     // default: 250
  maxMethods?: number;        // default: 20
  maxFields?: number;         // default: 15
  maxImports?: number;        // default: 20
}

/**
 * Check code metrics (file size, complexity, etc.)
 * Currently returns empty violations as these checks are aspirational
 */
export function checkCodeMetrics(_config: CodeMetricsConfig): string[] {
  // Code metrics checks are currently disabled/aspirational
  // Return empty violations for now
  return [];
}
