import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import path from 'node:path';
import fs from 'node:fs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
	title: 'Sharethrift Docs',
	tagline: 'Domain-Driven Design for Modern Azure Applications',
	favicon: 'img/favicon.ico',

	// Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
	future: {
		v4: true, // Improve compatibility with the upcoming Docusaurus v4
	},

	// Set the production url of your site here
	url: 'https://developers.sharethrift.com',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'Simnova', // Usually your GitHub org/user name.
	projectName: 'Sharethrift', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	markdown: {
		mermaid: true,
	},
	themes: ['@docusaurus/theme-mermaid'],

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/simnova/sharethrift/tree/main/packages/docs/',
				},
				blog: {
					showReadingTime: true,
					feedOptions: {
						type: ['rss', 'atom'],
						xslt: true,
					},
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/simnova/sharethrift/tree/main/packages/docs/',
					// Useful options to enforce blogging best practices
					onInlineTags: 'warn',
					onInlineAuthors: 'warn',
					onUntruncatedBlogPosts: 'warn',
				},
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: 'img/docusaurus-social-card.jpg',
		navbar: {
			title: 'Home',
			logo: {
				alt: 'Sharethrift Logo',
				src: 'img/logo.svg',
			},
			items: [
				{
					type: 'docSidebar',
					sidebarId: 'docsSidebar',
					position: 'left',
					label: 'Doc',
				},
				{ to: '/blog', label: 'Blog', position: 'left' },
				{
					href: 'https://github.com/simnova/sharethrift',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Doc',
							to: '/docs/intro',
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Stack Overflow',
							href: 'https://stackoverflow.com/questions/tagged/sharethrift',
						},
						{
							label: 'Discord',
							href: 'https://discordapp.com/invite/sharethrift',
						},
						{
							label: 'X',
							href: 'https://x.com/sharethrift',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'Blog',
							to: '/blog',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/simnova/sharethrift',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Simnova, Inc.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,

	// Custom webpack configuration for HTTPS dev server
	plugins: [
		function httpsPlugin() {
			return {
				name: 'https-plugin',
				configureWebpack() {
					const workspaceRoot = path.resolve(__dirname, '../../');
					const certKeyPath = path.join(workspaceRoot, '.certs/sharethrift.localhost-key.pem');
					const certPath = path.join(workspaceRoot, '.certs/sharethrift.localhost.pem');
					const hasCerts = fs.existsSync(certKeyPath) && fs.existsSync(certPath);

					if (hasCerts) {
						return {
							devServer: {
								server: {
									type: 'https',
									options: {
										key: fs.readFileSync(certKeyPath),
										cert: fs.readFileSync(certPath),
									},
								},
							},
						};
					}
					return {};
				},
			};
		},
	],
};

export default config;
