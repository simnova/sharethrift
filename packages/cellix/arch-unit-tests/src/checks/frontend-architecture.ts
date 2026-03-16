import * as fs from 'node:fs';
import * as path from 'node:path';
import { getAllFiles, isKebabCase } from '../utils/frontend-helpers.js';

export interface FrontendArchitectureConfig {
  uiSourcePath: string;  // e.g. '../../apps/ui-sharethrift/src'
}

/**
 * Check frontend architecture conventions
 */
export async function checkFrontendArchitecture(config: FrontendArchitectureConfig): Promise<string[]> {
  const violations: string[] = [];

  // Resolve the UI path relative to current working directory
  const resolvedPath = path.resolve(process.cwd(), config.uiSourcePath);

  // Check required directories using fs
  const hasComponents = fs.existsSync(path.join(resolvedPath, 'components'));
  const hasConfig = fs.existsSync(path.join(resolvedPath, 'config'));

  if (!hasComponents) {
    violations.push('Missing required directory: components');
  }
  if (!hasConfig) {
    violations.push('Missing required directory: config');
  }

  // Check layouts and shared directories
  const hasLayouts = fs.existsSync(path.join(resolvedPath, 'components', 'layouts'));
  const hasShared = fs.existsSync(path.join(resolvedPath, 'components', 'shared'));

  if (!hasLayouts) {
    violations.push('components/layouts directory is required');
  }

  if (!hasShared) {
    violations.push('components/shared directory is required');
  }

  // Get all files for further checks - use glob pattern relative to test location
  const allFiles = await getAllFiles(`${config.uiSourcePath}/**/*.tsx`);

  // Extract directory names from file paths and check kebab-case
  const allDirNames = new Set<string>();
  for (const file of allFiles) {
    const dir = path.dirname(file);
    const parts = dir.split(path.sep);
    for (const part of parts) {
      if (part && !part.startsWith('.') && part !== 'node_modules' && part !== 'coverage' && part !== 'build') {
        allDirNames.add(part);
      }
    }
  }

  for (const dir of allDirNames) {
    if (!isKebabCase(dir)) {
      violations.push(`Directory '${dir}' must use kebab-case naming`);
    }
  }

  // Check container files use kebab-case
  const containerFiles = allFiles.filter((f) => f.endsWith('.container.tsx'));
  for (const file of containerFiles) {
    const fileName = path.basename(file, '.container.tsx');
    if (!isKebabCase(fileName)) {
      violations.push(`Container file '${fileName}' must use kebab-case`);
    }
  }

  // Check story files use kebab-case
  const storyFiles = allFiles.filter((f) => f.endsWith('.stories.tsx'));
  for (const file of storyFiles) {
    let fileName = path.basename(file, '.stories.tsx');
    if (fileName.endsWith('.container')) {
      fileName = fileName.replace('.container', '');
    }
    if (!isKebabCase(fileName)) {
      violations.push(`Story file '${path.basename(file)}' must use kebab-case`);
    }
  }

  // Check layout requirements: each layout directory should have section-layout.tsx and index.tsx
  const layoutFiles = allFiles.filter((f) => f.includes('/components/layouts/'));
  const layoutDirs = new Set<string>();
  for (const file of layoutFiles) {
    const match = file.match(/\/components\/layouts\/([^/]+)\//);
    if (match?.[1]) {
      layoutDirs.add(match[1]);
    }
  }

  for (const layoutDir of layoutDirs) {
    const sectionLayoutPath = path.join(resolvedPath, 'components', 'layouts', layoutDir, 'section-layout.tsx');
    const sectionLayoutExists = fs.existsSync(sectionLayoutPath);
    if (!sectionLayoutExists) {
      violations.push(`Layout '${layoutDir}' must have section-layout.tsx`);
    }

    const indexPath = path.join(resolvedPath, 'components', 'layouts', layoutDir, 'index.tsx');
    const indexExists = fs.existsSync(indexPath);
    if (!indexExists) {
      violations.push(`Layout '${layoutDir}' must have index.tsx`);
    }
  }

  return violations;
}
