import { isAgent } from 'std-env';

const terminalFormat = isAgent ? '@cellix/serenity-framework/formatters/agent' : 'progress-bar';

export default {
	paths: ['../verification-shared/src/scenarios/**/*.feature'],
	import: ['src/world.ts', 'src/step-definitions/index.ts'],
	format: [terminalFormat, 'json:./reports/cucumber-report-api.json', 'html:./reports/cucumber-report-api.html'],
	formatOptions: {
		snippetInterface: 'async-await',
	},
	parallel: 1,
};
