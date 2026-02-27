import * as fs from 'node:fs';
import * as path from 'node:path';
import { getAllFiles, getDirectories, isKebabCase } from '../utils/frontend-helpers.js';

export interface FrontendArchitectureConfig {
  uiSourcePath: string;  // e.g. '../../apps/ui-sharethrift/src'
}

/**
 * Check frontend architecture conventions
 */
export function checkFrontendArchitecture(config: FrontendArchitectureConfig): string[] {
  const violations: string[] = [];
  const uiPath = path.join(process.cwd(), config.uiSourcePath);

  // Check required top-level directories
  const requiredDirs = ['components', 'config'];
  const existingDirs = getDirectories(uiPath);
  for (const dir of requiredDirs) {
    if (!existingDirs.includes(dir)) {
      violations.push(`Missing required directory: ${dir}`);
    }
  }

  // Check layouts and shared directories
  const layoutsPath = path.join(uiPath, 'components/layouts');
  if (!fs.existsSync(layoutsPath)) {
    violations.push('components/layouts directory is required');
  }

  const sharedPath = path.join(uiPath, 'components/shared');
  if (!fs.existsSync(sharedPath)) {
    violations.push('components/shared directory is required');
  }

  // Check kebab-case naming
  if (fs.existsSync(layoutsPath)) {
    const layoutDirs: string[] = getDirectories(layoutsPath);
    for (const dir of layoutDirs) {
      if (!isKebabCase(dir)) {
        violations.push(`Layout directory '${dir}' must use kebab-case`);
      }
    }
  }

  // Check all directories use kebab-case
  const allDirs: string[] = [];
  function collectDirs(dirPath: string): void {
    if (!fs.existsSync(dirPath)) return;
    const dirs: string[] = getDirectories(dirPath);
    for (const dir of dirs) {
      allDirs.push(dir);
      collectDirs(path.join(dirPath, dir));
    }
  }
  collectDirs(uiPath);

  const filteredDirs = allDirs.filter(
    (dir) => !dir.startsWith('.') && dir !== 'node_modules' && dir !== 'coverage' && dir !== 'build',
  );

  for (const dir of filteredDirs) {
    if (!isKebabCase(dir)) {
      violations.push(`Directory '${dir}' must use kebab-case naming`);
    }
  }

  // Check container files use kebab-case
  const containerFiles = getAllFiles(uiPath).filter((file) => file.endsWith('.container.tsx'));
  for (const file of containerFiles) {
    const fileName = path.basename(file, '.container.tsx');
    if (!isKebabCase(fileName)) {
      violations.push(`Container file '${fileName}' must use kebab-case`);
    }
  }

  // Check story files use kebab-case
  const storyFiles = getAllFiles(uiPath).filter((file) => file.endsWith('.stories.tsx'));
  for (const file of storyFiles) {
    let fileName = path.basename(file, '.stories.tsx');
    if (fileName.endsWith('.container')) {
      fileName = fileName.replace('.container', '');
    }
    if (!isKebabCase(fileName)) {
      violations.push(`Story file '${path.basename(file)}' must use kebab-case`);
    }
  }

  // Check layout requirements
  if (fs.existsSync(layoutsPath)) {
    const layoutDirs = getDirectories(layoutsPath);
    for (const layoutDir of layoutDirs) {
      const sectionLayoutPath = path.join(layoutsPath, layoutDir, 'section-layout.tsx');
      if (!fs.existsSync(sectionLayoutPath)) {
        violations.push(`Layout '${layoutDir}' must have section-layout.tsx`);
      }

      const indexPath = path.join(layoutsPath, layoutDir, 'index.tsx');
      if (!fs.existsSync(indexPath)) {
        violations.push(`Layout '${layoutDir}' must have index.tsx`);
      }
    }
  }

  // Component-story pairing is checked implicitly by the system

  return violations;
}
