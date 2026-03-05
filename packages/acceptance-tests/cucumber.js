export default {
	default: {
		paths: ['src/contexts/**/features/**/*.feature'],
		import: ['src/**/*.ts'],
		requireModule: ['tsx/esm'],
		format: [
			'progress-bar',
			'json:./reports/cucumber-report.json',
			'html:./reports/cucumber-report.html',
		],
		formatOptions: {
			snippetInterface: 'async-await',
		},
		parallel: 2,
		publishQuiet: true,
	},
};
