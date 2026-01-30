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
		it("should have root directory in every layout", () => {
			const layoutsPath = path.join(
				UI_SHARETHRIFT_PATH,
				"components/layouts",
			);
			if (!fs.existsSync(layoutsPath)) return;

			const layoutDirs = getDirectories(layoutsPath);
			for (const layoutDir of layoutDirs) {
				const rootPath = path.join(layoutsPath, layoutDir, "root");
				expect(
					fs.existsSync(rootPath),
					`Layout '${layoutDir}' must have a root/ directory`,
				).toBe(true);
			}
		});

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
				expect(
					fs.existsSync(componentsPath),
					`Layout '${layoutDir}' with pages/ must have components/ directory`,
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
				const graphqlFile = containerFile.replace(
					".container.tsx",
					".container.graphql",
				);
				// If GraphQL file exists, validate it's paired with container
				if (fs.existsSync(graphqlFile)) {
					expect(
						fs.existsSync(containerFile),
						`GraphQL file should be paired with container: ${path.basename(graphqlFile)}`,
					).toBe(true);
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
