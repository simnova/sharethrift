import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load GraphQL schema from .graphql files
 */
export function loadSchema(schemaName: string): string {
  try {
    const schemaPath = join(__dirname, 'types', `${schemaName}.graphql`);
    return readFileSync(schemaPath, 'utf8');
  } catch (error) {
    console.warn(`Failed to load schema ${schemaName}:`, error);
    return '';
  }
}

/**
 * Combine multiple GraphQL schemas into one
 */
export function combineSchemas(...schemaNames: string[]): string {
  const schemas = schemaNames.map(name => loadSchema(name)).filter(schema => schema.length > 0);
  
  // Add basic Query and Mutation types if not present
  const baseSchema = `#graphql
    type Query {
      _empty: String
    }
    
    type Mutation {
      _empty: String
    }
  `;
  
  return [baseSchema, ...schemas].join('\n\n');
}