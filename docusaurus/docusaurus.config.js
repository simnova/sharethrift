module.exports = {
  title: 'Sharethrift Docs',
  tagline: 'Documentation for Sharethrift',
  url: 'https://your-org.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'simnova', // GitHub org/user
  projectName: 'sharethrift', // Repo name
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
