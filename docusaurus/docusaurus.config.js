module.exports = {
  title: 'Sharethrift Docs',
  tagline: 'Documentation for Sharethrift',
  url: 'https://simnova.github.io/sharethrift',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'simnova', // GitHub org/user
  projectName: 'sharethrift', // Repo name
  trailingSlash: false,
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
