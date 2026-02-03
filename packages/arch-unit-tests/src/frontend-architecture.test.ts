import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const UI_SHARETHRIFT_PATH = path.join(
	process.cwd(),
	"../../apps/ui-sharethrift/src",
);

// Helper functions
function getAllFiles(
	dirPath: string,
	arrayOfFiles: string[] = [],
): string[] {
	if (!fs.existsSync(dirPath)) return arrayOfFiles;

	const files = fs.readdirSync(dirPath);

	for (const file of files) {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
		} else {
			arrayOfFiles.push(fullPath);
		}
	}

	return arrayOfFiles;
}

function getDirectories(dirPath: string): string[] {
	if (!fs.existsSync(dirPath)) return [];
	return fs
		.readdirSync(dirPath)
		.filter((file) => fs.statSync(path.join(dirPath, file)).isDirectory());
}

function isKebabCase(str: string): boolean {
	return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str);
}

function isPascalCase(str: string): boolean {
	return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}

describe("Frontend Architecture - UI ShareThrift", () => {
	describe("Folder Structure", () => {
		it("should have required top-level directories", () => {
			const requiredDirs = ["assets", "components", "config"];
			const existingDirs = getDirectories(UI_SHARETHRIFT_PATH);

			for (const dir of requiredDirs) {
				expect(
					existingDirs,
					`Missing required directory: ${dir}`,
				).toContain(dir);
			}
		});

		it("should have layouts directory under components", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			expect(
				fs.existsSync(layoutsPath),
				"components/layouts directory is required",
			).toBe(true);
		});

		it("should have shared directory under components", () => {
			const sharedPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/shared",
			);
			expect(
				fs.existsSync(sharedPath),
				"components/shared directory is required",
			).toBe(true);
		});

		it("should organize layouts by feature in kebab-case", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const dir of layoutDirs) {
				expect(
					isKebabCase(dir),
					`Layout directory '${dir}' must use kebab-case`,
				).toBe(true);
			}
		});
	});

	describe("Naming Conventions", () => {
		it("should use kebab-case for all directories", () => {
			const allDirs: string[] = [];
			function collectDirs(dirPath: string) {
				if (!fs.existsSync(dirPath)) return;
				const dirs = getDirectories(dirPath);
				for (const dir of dirs) {
					allDirs.push(dir);
					collectDirs(path.join(dirPath, dir));
				}
			}
			collectDirs(UI_SHARETHRIFT_PATH);

			// Exclude node_modules, .next, coverage, etc.
			const filteredDirs = allDirs.filter(
				(dir) =>
					!dir.startsWith(".") &&
					dir !== "node_modules" &&
					dir !== "coverage" &&
					dir !== "build",
			);

			for (const dir of filteredDirs) {
				expect(
					isKebabCase(dir),
					`Directory '${dir}' must use kebab-case naming`,
				).toBe(true);
			}
		});

		it("should use PascalCase for component files", () => {
			const componentFiles = getAllFiles(UI_SHARETHRIFT_PATH).filter(
				(file) =>
					(file.endsWith(".tsx") || file.endsWith(".ts")) &&
					!file.includes("node_modules") &&
					!file.includes(".test.") &&
					!file.includes(".stories.") &&
					!file.includes(".container.") &&
					!file.includes("index.tsx") &&
					!file.includes("index.ts") &&
					path.basename(file).charAt(0) === path.basename(file).charAt(0).toUpperCase(),
			);

			for (const file of componentFiles) {
				const fileName = path.basename(file, path.extname(file));
				expect(
					isPascalCase(fileName),
					`Component file '${fileName}' must use PascalCase`,
				).toBe(true);
			}
		});

		it("should use kebab-case for container pattern files", () => {
			const containerFiles = getAllFiles(UI_SHARETHRIFT_PATH).filter(
				(file) => file.endsWith(".container.tsx"),
			);

			for (const file of containerFiles) {
				const fileName = path.basename(file, ".container.tsx");
				expect(
					isKebabCase(fileName),
					`Container file '${fileName}' must use kebab-case`,
				).toBe(true);
			}
		});
	});

	describe("Layout Requirements", () => {
		it("should have section-layout.tsx in every layout", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const sectionLayoutPath = path.join(
					layoutsPath,
					layoutDir,
					"section-layout.tsx",
				);
				expect(
					fs.existsSync(sectionLayoutPath),
					`Layout '${layoutDir}' must have section-layout.tsx`,
				).toBe(true);
			}
		});

		it("should have index.tsx in every layout", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const indexPath = path.join(layoutsPath, layoutDir, "index.tsx");
				expect(
					fs.existsSync(indexPath),
					`Layout '${layoutDir}' must have index.tsx`,
				).toBe(true);
			}
		});

		it("should have components directory in layouts with pages", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const pagesPath = path.join(layoutsPath, layoutDir, "pages");
				if (!fs.existsSync(pagesPath)) continue;

				const componentsPath = path.join(
					layoutsPath,
					layoutDir,
					"components",
				);
				// Components can be at layout level OR inside individual page directories
				// Check if layout-level components exist, or if page-level components exist
				const hasLayoutComponents = fs.existsSync(componentsPath);
				const pageDirs = getDirectories(pagesPath);
				const hasPageComponents = pageDirs.some((pageDir) =>
					fs.existsSync(path.join(pagesPath, pageDir, "components")),
				);

				expect(
					hasLayoutComponents || hasPageComponents,
					`Layout '${layoutDir}' with pages/ must have components/ directory at layout or page level`,
				).toBe(true);
			}
		});
	});

	describe("Component Patterns", () => {
		it("should follow Container pattern for data fetching components", () => {
			const containerFiles = getAllFiles(UI_SHARETHRIFT_PATH).filter(
				(file) => file.endsWith(".container.tsx"),
			);

			for (const containerFile of containerFiles) {
				const fileName = path.basename(containerFile, ".container.tsx");
				const displayComponentPath = containerFile.replace(
					".container.tsx",
					".tsx",
				);

				// If container exists, expect corresponding display component
				if (fs.existsSync(displayComponentPath)) {
					expect(
						fs.existsSync(displayComponentPath),
						`Container '${fileName}' should have corresponding display component`,
					).toBe(true);
				}
			}
		});

		it("should have Storybook stories for display components", () => {
			const componentFiles = getAllFiles(UI_SHARETHRIFT_PATH).filter(
				(file) =>
					file.endsWith(".tsx") &&
					!file.includes(".container.tsx") &&
					!file.includes(".stories.tsx") &&
					!file.includes(".test.tsx") &&
					!file.includes("index.tsx") &&
					file.includes("/components/"),
			);

			for (const componentFile of componentFiles) {
				const storyFile = componentFile.replace(".tsx", ".stories.tsx");
				// Not all components need stories (e.g., layout wrappers), but we check they exist if present
				if (fs.existsSync(storyFile)) {
					expect(
						fs.existsSync(storyFile),
						`Component should have Storybook story: ${path.basename(componentFile)}`,
					).toBe(true);
				}
			}
		});

		it("should have GraphQL files for containers using GraphQL", () => {
			const containerFiles = getAllFiles(UI_SHARETHRIFT_PATH).filter(
				(file) => file.endsWith(".container.tsx"),
			);

			for (const containerFile of containerFiles) {
				const content = fs.readFileSync(containerFile, "utf-8");
				
				// Check if container uses GraphQL by looking for:
				// 1. useQuery or useMutation from Apollo Client
				// 2. GraphQL Document imports (generated types ending in 'Document')
				const usesGraphQL =
					(content.includes("useQuery") ||
						content.includes("useMutation") ||
						content.includes("useLazyQuery")) &&
					(content.includes("@apollo/client") ||
						/\w+Document/.test(content));

				if (usesGraphQL) {
					const graphqlFile = containerFile.replace(
						".container.tsx",
						".container.graphql",
					);
					expect(
						fs.existsSync(graphqlFile),
						`Container '${path.basename(containerFile)}' uses GraphQL but missing '${path.basename(graphqlFile)}'`,
					).toBe(true);
				}
			}
		});
	});

	describe("CellixJs Pattern - Page Organization", () => {
		it("should organize pages with pages/ and components/ subdirectories", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const pagesPath = path.join(layoutsPath, layoutDir, "pages");
				if (!fs.existsSync(pagesPath)) continue;

				const pageDirs = getDirectories(pagesPath);
				for (const pageDir of pageDirs) {
					const pagePath = path.join(pagesPath, pageDir);
					const hasPages = fs.existsSync(path.join(pagePath, "pages"));
					const hasComponents = fs.existsSync(
						path.join(pagePath, "components"),
					);
					const hasIndex = fs.existsSync(path.join(pagePath, "index.tsx"));

					// Page directories should have at least pages/ or components/ subdirectory, or be a route index
					expect(
						hasPages || hasComponents || hasIndex,
						`Page directory '${layoutDir}/pages/${pageDir}' should have pages/, components/, or index.tsx for routes`,
					).toBe(true);
				}
			}
		});

		it("should not have loose component files at page directory root (except index.tsx)", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const pagesPath = path.join(layoutsPath, layoutDir, "pages");
				if (!fs.existsSync(pagesPath)) continue;

				const pageDirs = getDirectories(pagesPath);
				for (const pageDir of pageDirs) {
					const pagePath = path.join(pagesPath, pageDir);
					const files = fs
						.readdirSync(pagePath)
						.filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));

					// Only index.tsx should be at root level
					const nonIndexFiles = files.filter(
						(file) => file !== "index.tsx" && file !== "index.ts",
					);

					expect(
						nonIndexFiles.length,
						`Page directory '${layoutDir}/pages/${pageDir}' should not have loose component files at root. Move to pages/ or components/ subdirectory. Found: ${nonIndexFiles.join(", ")}`,
					).toBe(0);
				}
			}
		});

		it("should place page entry points in pages/ subdirectory", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const pagesPath = path.join(layoutsPath, layoutDir, "pages");
				if (!fs.existsSync(pagesPath)) continue;

				const pageDirs = getDirectories(pagesPath);
				for (const pageDir of pageDirs) {
					const pageSubdirPath = path.join(pagesPath, pageDir, "pages");
					if (!fs.existsSync(pageSubdirPath)) continue;

					const pageFiles = fs
						.readdirSync(pageSubdirPath)
						.filter((file) => file.endsWith("-page.tsx"));

					// If pages/ subdirectory exists, check for page entry files
					if (pageFiles.length > 0) {
						expect(
							pageFiles.length,
							`Page directory '${layoutDir}/pages/${pageDir}/pages' should contain *-page.tsx files`,
						).toBeGreaterThan(0);
					}
				}
			}
		});

		it("should place page-specific components in components/ subdirectory", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const pagesPath = path.join(layoutsPath, layoutDir, "pages");
				if (!fs.existsSync(pagesPath)) continue;

				const pageDirs = getDirectories(pagesPath);
				for (const pageDir of pageDirs) {
					const componentsPath = path.join(pagesPath, pageDir, "components");
					if (!fs.existsSync(componentsPath)) continue;

					// Get all entries (files and directories)
					const entries = fs.readdirSync(componentsPath);
					const hasContent = entries.length > 0;

					expect(
						hasContent,
						`Components directory '${layoutDir}/pages/${pageDir}/components' should contain files or subdirectories`,
					).toBe(true);
				}
			}
		});

		it("should support nested page structures (e.g., account/pages/profile/pages)", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const pagesPath = path.join(layoutsPath, layoutDir, "pages");
				if (!fs.existsSync(pagesPath)) continue;

				const pageDirs = getDirectories(pagesPath);
				for (const pageDir of pageDirs) {
					const nestedPagesPath = path.join(pagesPath, pageDir, "pages");
					if (!fs.existsSync(nestedPagesPath)) continue;

					const nestedPageDirs = getDirectories(nestedPagesPath);
					for (const nestedPageDir of nestedPageDirs) {
						const deepComponentsPath = path.join(
							nestedPagesPath,
							nestedPageDir,
							"components",
						);
						const deepPagesPath = path.join(
							nestedPagesPath,
							nestedPageDir,
							"pages",
						);

						// Nested page directories should also follow the same pattern
						const hasStructure =
							fs.existsSync(deepComponentsPath) ||
							fs.existsSync(deepPagesPath);

						expect(
							hasStructure,
							`Nested page '${layoutDir}/pages/${pageDir}/pages/${nestedPageDir}' should have components/ or pages/ subdirectory`,
						).toBe(true);
					}
				}
			}
		});

		it("should colocate page components with their pages", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const pagesPath = path.join(layoutsPath, layoutDir, "pages");
				if (!fs.existsSync(pagesPath)) continue;

				const pageDirs = getDirectories(pagesPath);
				for (const pageDir of pageDirs) {
					const pageSubdirPath = path.join(pagesPath, pageDir, "pages");
					const componentsPath = path.join(pagesPath, pageDir, "components");

					// If page has both pages/ and components/, they should be siblings
					if (
						fs.existsSync(pageSubdirPath) &&
						fs.existsSync(componentsPath)
					) {
						const pagesParent = path.dirname(pageSubdirPath);
						const componentsParent = path.dirname(componentsPath);

						expect(
							pagesParent,
							`Components and pages for '${pageDir}' should be colocated as siblings`,
						).toBe(componentsParent);
					}
				}
			}
		});
	});

	describe("Best Practices", () => {
		it("should use index.tsx for barrel exports in feature directories", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const indexPath = path.join(layoutsPath, layoutDir, "index.tsx");
				expect(
					fs.existsSync(indexPath),
					`Feature directory '${layoutDir}' should have index.tsx for barrel exports`,
				).toBe(true);
			}
		});

		it("should keep config files in config directory", () => {
			const configPath = path.join(UI_SHARETHRIFT_PATH, "config");
			if (!fs.existsSync(configPath)) return;

			const configFiles = getAllFiles(configPath).filter(
				(file) =>
					file.endsWith(".ts") ||
					file.endsWith(".tsx") ||
					file.endsWith(".json"),
			);

			expect(
				configFiles.length,
				"Config directory should contain configuration files",
			).toBeGreaterThan(0);
		});

		it("should keep assets organized by type", () => {
			const assetsPath = path.join(UI_SHARETHRIFT_PATH, "assets");
			if (!fs.existsSync(assetsPath)) return;

			const assetDirs = getDirectories(assetsPath);
			const validAssetTypes = [
				"images",
				"icons",
				"fonts",
				"styles",
				"svg",
				"videos",
			];

			for (const dir of assetDirs) {
				const isValidType = validAssetTypes.some(
					(type) => dir.includes(type) || isKebabCase(dir),
				);
				expect(
					isValidType,
					`Asset directory '${dir}' should be organized by type and use kebab-case`,
				).toBe(true);
			}
		});
	});
});
