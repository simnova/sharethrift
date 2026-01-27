import { projectFiles } from 'archunit';
import { describe, expect, it } from 'vitest';

describe('GraphQL Resolver Conventions', () => {
	describe('Dependency Rules', () => {
		it('resolver files should not import domain entities directly', async () => {
			const rule = projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.shouldNot()
				.dependOnFiles()
				.inPath('../sthrift/domain/src/domain/contexts/**/*.entity.ts');

			await expect(rule).toPassAsync();
		});

		it('resolver files should not import repositories directly', async () => {
			const rule = projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.shouldNot()
				.dependOnFiles()
				.inPath('../sthrift/domain/src/domain/contexts/**/*.repository.ts');

			await expect(rule).toPassAsync();
		});

		it('resolver files should not import Unit of Work classes directly', async () => {
			const rule = projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.shouldNot()
				.dependOnFiles()
				.inPath('../sthrift/domain/src/domain/contexts/**/*.uow.ts');

			await expect(rule).toPassAsync();
		});

		it('resolver files should not import infrastructure services directly', async () => {
			const rule = projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.shouldNot()
				.dependOnFiles()
				.inPath('../sthrift/service-*/**');

			await expect(rule).toPassAsync();
		});

		it('resolver files should not import persistence layer directly', async () => {
			const rule = projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.shouldNot()
				.dependOnFiles()
				.inFolder('../sthrift/persistence/**');

			await expect(rule).toPassAsync();
		});
	});

	describe('Content Patterns', () => {
		it('resolver files must export a default object', async () => {
			const allViolations: string[] = [];
			const ruleDesc = 'Resolver files must export a default resolver object';

			await projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.should()
				.adhereTo((file) => {
					const hasDefaultExport = /export default \w+/.test(file.content);
					if (!hasDefaultExport) {
						allViolations.push(
							`[${file.path}] Missing default export of resolver object`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('resolver files should not define extra interfaces, types, classes, or enums', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'Resolver files should not define interfaces, types, classes, or enums';

			await projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.should()
				.adhereTo((file) => {
					const violations: string[] = [];

					// Check for interface definitions (export or not)
					const interfacePattern = /^\s*(export\s+)?interface\s+\w+/gm;
					const interfaces = file.content.match(interfacePattern);
					if (interfaces) {
						violations.push(`interfaces: ${interfaces.join(', ')}`);
					}

					// Check for type definitions (export or not) - excluding import type statements
					const typePattern = /^\s*(export\s+)?type\s+\w+\s*=/gm;
					const types = file.content.match(typePattern);
					if (types) {
						violations.push(`types: ${types.join(', ')}`);
					}

					// Check for class definitions (export or not)
					const classPattern = /^\s*(export\s+)?class\s+\w+/gm;
					const classes = file.content.match(classPattern);
					if (classes) {
						violations.push(`classes: ${classes.join(', ')}`);
					}

					// Check for enum definitions (export or not)
					const enumPattern = /^\s*(export\s+)?enum\s+\w+/gm;
					const enums = file.content.match(enumPattern);
					if (enums) {
						violations.push(`enums: ${enums.join(', ')}`);
					}

					// Check for named exports of anything
					const namedExportPattern =
						/^export\s+(const|function|interface|type|class|enum)\s+/gm;
					const namedExports = file.content.match(namedExportPattern);
					if (namedExports) {
						violations.push(`named exports: ${namedExports.join(', ')}`);
					}

					if (violations.length > 0) {
						allViolations.push(
							`[${file.path}] Contains disallowed definitions: ${violations.join('; ')}.`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('resolver objects should be typed as Resolvers', async () => {
			const allViolations: string[] = [];
			const ruleDesc = 'Resolver objects must be typed as Resolvers from generated schema';

			await projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.should()
				.adhereTo((file) => {
					const hasResolversType = /:\s*Resolvers\s*=/.test(file.content);
					if (!hasResolversType) {
						allViolations.push(
							`[${file.path}] Resolver object not typed as Resolvers`,
						);
						return false;
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('resolver context parameter must be typed as GraphContext', async () => {
			const allViolations: string[] = [];
			const ruleDesc =
				'Resolver context parameter must be explicitly typed as GraphContext';

			await projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.should()
				.adhereTo((file) => {
					// Only check if file has context parameters
					if (/context[,)]/.test(file.content)) {
						const hasGraphContext = /context:\s*GraphContext/.test(file.content);
						if (!hasGraphContext) {
							allViolations.push(
								`[${file.path}] Context parameter not typed as GraphContext`,
							);
							return false;
						}
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});

		it('resolver functions should be declared as async', async () => {
			const allViolations: string[] = [];
			const ruleDesc = 'Resolver functions must be async to support await operations';

			await projectFiles()
				.inFolder('../sthrift/graphql/src/schema/types/**')
				.withName('*.resolvers.ts')
				.should()
				.adhereTo((file) => {
					// Check if there are resolver function definitions
					const hasResolverFunctions =
						/Query:|Mutation:|[A-Z]\w+:/.test(file.content);
					if (hasResolverFunctions) {
						const hasAsyncFunctions = /async\s*\(/.test(file.content);
						if (!hasAsyncFunctions) {
							allViolations.push(
								`[${file.path}] Resolver functions should be declared as async`,
							);
							return false;
						}
					}
					return true;
				}, ruleDesc)
				.check();

			expect(allViolations).toStrictEqual([]);
		});
	});
});
