import type { FileInfo } from 'archunit';
import { projectFiles } from 'archunit';

import { isKebabCase } from '../utils/frontend-helpers.js';

// ────────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────────

export interface GraphqlSchemaConventionsConfig {
	graphqlGlob: string;
	excludeFiles?: string[];
}

// ────────────────────────────────────────────────────────────────
// Internal helpers — lightweight GraphQL SDL parsing
// ────────────────────────────────────────────────────────────────

/** Strip comments and blank lines */
function stripComments(content: string): string {
	return content
		.replace(/#[^\n]*/g, '')
		.replace(/"""[\s\S]*?"""/g, '')
		.replace(/"[^"]*"/g, '""');
}

/** Convert kebab-case filename (without extension) to expected PascalCase type name */
function kebabToPascal(kebab: string): string {
	return kebab
		.split('-')
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join('');
}

interface ParsedDefinition {
	kind: 'type' | 'input' | 'enum' | 'union' | 'interface' | 'extend';
	extendedKind?: string; // 'Query' | 'Mutation' when kind === 'extend'
	name: string;
	body: string;
	implements?: string;
	position: number; // character offset in the stripped content
}

function parseDefinitions(content: string): ParsedDefinition[] {
	const stripped = stripComments(content);
	const defs: ParsedDefinition[] = [];

	// Match top-level definitions: type Foo { ... }, input Foo { ... }, enum Foo { ... }, union Foo = ...
	// Also match extend type Query { ... } etc.
	const defRegex =
		/\b(extend\s+)?(type|input|enum|union|interface)\s+(\w+)(?:\s+implements\s+(\w+))?\s*(?:[={])/g;
	let match = defRegex.exec(stripped);

	while (match !== null) {
		const isExtend = !!match[1];
		const kind = match[2] as ParsedDefinition['kind'];
		const name = match[3] as string;
		const implementsInterface = match[4];

		// Extract the body between { and its matching }
		const startIdx = stripped.indexOf('{', match.index + match[0].length - 1);
		let body = '';
		if (startIdx !== -1) {
			let depth = 1;
			let i = startIdx + 1;
			while (i < stripped.length && depth > 0) {
				if (stripped[i] === '{') depth++;
				if (stripped[i] === '}') depth--;
				i++;
			}
			body = stripped.slice(startIdx + 1, i - 1);
		} else if (kind === 'union') {
			// unions use = not { }
			const lineEnd = stripped.indexOf('\n', match.index);
			body = stripped.slice(match.index, lineEnd === -1 ? undefined : lineEnd);
		}

		if (isExtend) {
			defs.push({ kind: 'extend', extendedKind: name, name, body, position: match.index });
		} else {
			defs.push({
				kind,
				name,
				body,
				position: match.index,
				...(implementsInterface && { implements: implementsInterface }),
			});
		}
		match = defRegex.exec(stripped);
	}

	return defs;
}

/** Extract mutation field names and their return types from a Mutation extend block body */
function parseMutationFields(body: string): Array<{ name: string; returnType: string }> {
	const fields: Array<{ name: string; returnType: string }> = [];
	// Match: fieldName(...): ReturnType or fieldName(...): ReturnType!
	const fieldRegex = /(\w+)\s*\([^)]*\)\s*:\s*([^\n!]+!?)/g;
	let match = fieldRegex.exec(body);
	while (match !== null) {
		fields.push({ name: match[1] as string, returnType: (match[2] as string).trim() });
		match = fieldRegex.exec(body);
	}
	return fields;
}

// ────────────────────────────────────────────────────────────────
// Check functions
// ────────────────────────────────────────────────────────────────

/**
 * Check that .graphql files in the types directory use lower-kebab-case naming
 */
export async function checkGraphqlSchemaFileNaming(config: GraphqlSchemaConventionsConfig): Promise<string[]> {
	if (!config.graphqlGlob) {
		throw new Error('checkGraphqlSchemaFileNaming requires graphqlGlob to be set');
	}

	const violations: string[] = [];
	const excluded = new Set(config.excludeFiles ?? []);

	await projectFiles()
		.inPath(config.graphqlGlob)
		.should()
		.adhereTo((file: FileInfo) => {
			const fileName = file.path.split('/').pop() ?? '';
			if (excluded.has(fileName)) return true;

			const stem = fileName.replace('.graphql', '');
			if (!isKebabCase(stem)) {
				violations.push(`[${fileName}] File name must use lower-kebab-case`);
				return false;
			}
			return true;
		}, 'GraphQL files must use lower-kebab-case naming')
		.check();

	return violations;
}

/**
 * Check that type names in each .graphql file are properly prefixed with the top-level type name
 */
export async function checkGraphqlSchemaTypePrefixing(config: GraphqlSchemaConventionsConfig): Promise<string[]> {
	if (!config.graphqlGlob) {
		throw new Error('checkGraphqlSchemaTypePrefixing requires graphqlGlob to be set');
	}

	const violations: string[] = [];
	const excluded = new Set(config.excludeFiles ?? []);

	await projectFiles()
		.inPath(config.graphqlGlob)
		.should()
		.adhereTo((file: FileInfo) => {
			const fileName = file.path.split('/').pop() ?? '';
			if (excluded.has(fileName)) return true;

			const stem = fileName.replace('.graphql', '');
			const expectedPrefix = kebabToPascal(stem);
			const content = file.content;
			const defs = parseDefinitions(content);

			let hasViolation = false;
			for (const def of defs) {
				// Skip extend blocks — they extend Query/Mutation, not owned types
				if (def.kind === 'extend') continue;
				// Skip enums — they follow their own naming
				if (def.kind === 'enum') continue;

				if (!def.name.startsWith(expectedPrefix)) {
					violations.push(
						`[${fileName}] ${def.kind} "${def.name}" must be prefixed with "${expectedPrefix}"`,
					);
					hasViolation = true;
				}
			}
			return !hasViolation;
		}, 'GraphQL types must follow prefixing conventions')
		.check();

	return violations;
}

/**
 * Check that MutationResult types follow conventions:
 * - Named <<TopLevelType>>MutationResult
 * - Implements MutationResult interface
 * - Has status: MutationStatus! field
 * - Has a field for the top-level type
 */
export async function checkGraphqlSchemaMutationResults(config: GraphqlSchemaConventionsConfig): Promise<string[]> {
	if (!config.graphqlGlob) {
		throw new Error('checkGraphqlSchemaMutationResults requires graphqlGlob to be set');
	}

	const violations: string[] = [];
	const excluded = new Set(config.excludeFiles ?? []);

	await projectFiles()
		.inPath(config.graphqlGlob)
		.should()
		.adhereTo((file: FileInfo) => {
			const fileName = file.path.split('/').pop() ?? '';
			if (excluded.has(fileName)) return true;

			const stem = fileName.replace('.graphql', '');
			const topLevelType = kebabToPascal(stem);
			const content = file.content;
			const defs = parseDefinitions(content);

			// Find MutationResult types
			const mutationResults = defs.filter(
				(d) => d.kind === 'type' && d.name.endsWith('MutationResult'),
			);

			let hasViolation = false;
			for (const mr of mutationResults) {
				// Must implement MutationResult interface
				if (mr.implements !== 'MutationResult') {
					violations.push(
						`[${fileName}] type "${mr.name}" must implement MutationResult interface`,
					);
					hasViolation = true;
				}

				// Must have status: MutationStatus! field
				if (!/status\s*:\s*MutationStatus!/.test(mr.body)) {
					violations.push(
						`[${fileName}] type "${mr.name}" must have field "status: MutationStatus!"`,
					);
					hasViolation = true;
				}
			}

			// Check that mutations in this file return a MutationResult type
			const mutationExtends = defs.filter(
				(d) => d.kind === 'extend' && d.extendedKind === 'Mutation',
			);

			for (const ext of mutationExtends) {
				const fields = parseMutationFields(ext.body);

				for (const field of fields) {
					const returnType = field.returnType.replace('!', '').trim();
					if (!returnType.endsWith('MutationResult')) {
						violations.push(
							`[${fileName}] mutation "${field.name}" must return a MutationResult type (e.g. ${topLevelType}MutationResult!), got "${field.returnType}"`,
						);
						hasViolation = true;
					}
				}
			}
			return !hasViolation;
		}, 'GraphQL mutations must follow MutationResult conventions')
		.check();

	return violations;
}

/**
 * Check that input types follow naming conventions:
 * - Must end with "Input"
 * - Must be prefixed with the top-level type name (or a mutation name derived from it)
 */
export async function checkGraphqlSchemaInputNaming(config: GraphqlSchemaConventionsConfig): Promise<string[]> {
	if (!config.graphqlGlob) {
		throw new Error('checkGraphqlSchemaInputNaming requires graphqlGlob to be set');
	}

	const violations: string[] = [];
	const excluded = new Set(config.excludeFiles ?? []);

	await projectFiles()
		.inPath(config.graphqlGlob)
		.should()
		.adhereTo((file: FileInfo) => {
			const fileName = file.path.split('/').pop() ?? '';
			if (excluded.has(fileName)) return true;

			const content = file.content;
			const defs = parseDefinitions(content);

			const inputDefs = defs.filter((d) => d.kind === 'input');

			let hasViolation = false;
			for (const inp of inputDefs) {
				if (!inp.name.endsWith('Input')) {
					violations.push(
						`[${fileName}] input type "${inp.name}" must end with "Input"`,
					);
					hasViolation = true;
				}
			}
			return !hasViolation;
		}, 'GraphQL input types must follow naming conventions')
		.check();

	return violations;
}

/**
 * Ordering categories for definitions within a GraphQL schema file.
 * The expected order (top to bottom) is:
 *   0 = Top-level type (main entity)
 *   1 = Sub-types (read types — nested output types)
 *   2 = Enums
 *   3 = Input types (write types)
 *   4 = MutationResult type
 *   5 = extend type Query
 *   6 = extend type Mutation
 */
function getDefinitionOrderCategory(def: ParsedDefinition, topLevelType: string): number {
	if (def.kind === 'extend' && def.extendedKind === 'Query') return 5;
	if (def.kind === 'extend' && def.extendedKind === 'Mutation') return 6;
	if (def.kind === 'extend') return 5; // other extends treated as query-level
	if (def.kind === 'input') return 3;
	if (def.kind === 'enum') return 2;
	if (def.kind === 'type' && def.name.endsWith('MutationResult')) return 4;
	if (def.kind === 'type' && def.name === topLevelType) return 0;
	if (def.kind === 'type') return 1; // sub-types
	if (def.kind === 'union') return 1;
	if (def.kind === 'interface') return 1;
	return 1;
}

const orderCategoryNames = [
	'top-level type',
	'sub-types',
	'enums',
	'input types',
	'MutationResult type',
	'extend type Query',
	'extend type Mutation',
];

/**
 * Check that definitions within each .graphql file follow the expected ordering:
 * TopLevelType → SubTypes → Enums → Inputs → MutationResult → Query → Mutation
 */
export async function checkGraphqlSchemaOrdering(config: GraphqlSchemaConventionsConfig): Promise<string[]> {
	if (!config.graphqlGlob) {
		throw new Error('checkGraphqlSchemaOrdering requires graphqlGlob to be set');
	}

	const violations: string[] = [];
	const excluded = new Set(config.excludeFiles ?? []);

	await projectFiles()
		.inPath(config.graphqlGlob)
		.should()
		.adhereTo((file: FileInfo) => {
			const fileName = file.path.split('/').pop() ?? '';
			if (excluded.has(fileName)) return true;

			const stem = fileName.replace('.graphql', '');
			const topLevelType = kebabToPascal(stem);
			const content = file.content;
			const defs = parseDefinitions(content);

			// Sort definitions by their position in the file (already in order from parsing)
			const sorted = [...defs].sort((a, b) => a.position - b.position);

			let maxCategorySoFar = -1;
			let maxCategoryName = '';
			let hasViolation = false;

			for (const def of sorted) {
				const category = getDefinitionOrderCategory(def, topLevelType);
				if (category < maxCategorySoFar) {
					const defLabel = def.kind === 'extend' ? `extend type ${def.extendedKind}` : `${def.kind} ${def.name}`;
					const categoryName = orderCategoryNames[category] ?? 'unknown';
					violations.push(
						`[${fileName}] "${defLabel}" (${categoryName}) appears after ${maxCategoryName} — expected order: TopLevelType → SubTypes → Enums → Inputs → MutationResult → Query → Mutation`,
					);
					hasViolation = true;
				} else if (category > maxCategorySoFar) {
					maxCategorySoFar = category;
					const defLabel = def.kind === 'extend' ? `extend type ${def.extendedKind}` : `${def.kind} ${def.name}`;
					maxCategoryName = `"${defLabel}" (${orderCategoryNames[category] ?? 'unknown'})`;
				}
			}
			return !hasViolation;
		}, 'GraphQL definitions must follow proper ordering')
		.check();

	return violations;
}

/**
 * Check all GraphQL schema conventions at once and return categorized violations
 */
export async function checkGraphqlSchemaConventions(config: GraphqlSchemaConventionsConfig): Promise<string[]> {
	if (!config.graphqlGlob) {
		throw new Error('checkGraphqlSchemaConventions requires graphqlGlob to be set');
	}

	return [
		...(await checkGraphqlSchemaFileNaming(config)),
		...(await checkGraphqlSchemaTypePrefixing(config)),
		...(await checkGraphqlSchemaMutationResults(config)),
		...(await checkGraphqlSchemaInputNaming(config)),
		...(await checkGraphqlSchemaOrdering(config)),
	];
}
