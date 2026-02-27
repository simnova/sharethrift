import { projectFiles } from 'archunit';

export interface NamingConventionsConfig {
  graphqlFilePaths?: string[];  // e.g. ['../sthrift/graphql/src/**/*.graphql']
}

/**
 * Check GraphQL file naming conventions
 */
export async function checkGraphqlFileNaming(config: NamingConventionsConfig): Promise<string[]> {
  const allViolations: string[] = [];

  if (!config.graphqlFilePaths || config.graphqlFilePaths.length === 0) {
    return [];
  }

  for (const globlPattern of config.graphqlFilePaths) {
    await projectFiles()
      .inPath(globlPattern)
      .should()
      .adhereTo((file) => {
        const fileName = file.path.split('/').pop() || '';

        // Check if filename ends with .container.graphql
        if (!fileName.endsWith('.container.graphql')) {
          allViolations.push(
            `[${file.path}] GraphQL file must be named *.container.graphql`,
          );
          return false;
        }
        return true;
      }, 'All GraphQL files in UI packages must be named *.container.graphql')
      .check();
  }

  return allViolations;
}
