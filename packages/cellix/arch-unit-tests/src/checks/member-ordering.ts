import { projectFiles, type FileInfo } from 'archunit';
import { checkMemberOrdering as checkMemberOrderingRule } from '../utils/member-ordering-rule.js';

export interface MemberOrderingConfig {
  sourceGlobs: string[];  // e.g. ['../sthrift/domain/src/**/*.ts']
}

/**
 * Check that class members follow proper ordering convention
 */
export async function checkMemberOrdering(config: MemberOrderingConfig): Promise<string[]> {
  if (!config.sourceGlobs || config.sourceGlobs.length === 0) {
    throw new Error('checkMemberOrdering requires at least one sourceGlob to be set');
  }

  const allViolations: string[] = [];

  // Use archunit to find all matching files and check them
  for (const glob of config.sourceGlobs) {
    await projectFiles()
      .inPath(glob)
      .should()
      .adhereTo((file: FileInfo) => {
        const result = checkMemberOrderingRule(file);
        if (result !== true) {
          allViolations.push(...result);
          return false;
        }
        return true;
      }, 'Class members must follow proper ordering')
      .check();
  }

  return allViolations;
}
