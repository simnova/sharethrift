import { isAgent } from 'std-env';

const terminalFormat = isAgent ? '@cellix/serenity-framework/formatters/agent' : 'progress-bar';

export default {
	paths: ['../verification-shared/src/scenarios/**/*.feature', 'src/scenarios/**/*.feature'],
	import: ['src/world.ts', 'src/contexts/**/step-definitions/**/*.steps.ts', 'src/shared/**/*.ts'],
	format: [terminalFormat, 'json:./reports/cucumber-report.json', 'html:./reports/cucumber-report.html'],
	formatOptions: {
		snippetInterface: 'async-await',
	},
	parallel: 1,
};
