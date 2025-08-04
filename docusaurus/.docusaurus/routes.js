import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '43c'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '30a'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '6bd'),
            routes: [
              {
                path: '/docs/decisions/adr-short-template',
                component: ComponentCreator('/docs/decisions/adr-short-template', '7ae'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/adr-template',
                component: ComponentCreator('/docs/decisions/adr-template', '932'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/authorization',
                component: ComponentCreator('/docs/decisions/authorization', '58f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/azure-infrastructure-deployments',
                component: ComponentCreator('/docs/decisions/azure-infrastructure-deployments', '250'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/bicep',
                component: ComponentCreator('/docs/decisions/bicep', '264'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/cache-purging',
                component: ComponentCreator('/docs/decisions/cache-purging', '955'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/domain-driven-design',
                component: ComponentCreator('/docs/decisions/domain-driven-design', '701'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/identity-access',
                component: ComponentCreator('/docs/decisions/identity-access', '6bb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/linter',
                component: ComponentCreator('/docs/decisions/linter', '7f0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/madr-architecture-decisions',
                component: ComponentCreator('/docs/decisions/madr-architecture-decisions', 'c38'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/maps',
                component: ComponentCreator('/docs/decisions/maps', '963'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/open-telemetry',
                component: ComponentCreator('/docs/decisions/open-telemetry', 'da4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/react-router-loaders',
                component: ComponentCreator('/docs/decisions/react-router-loaders', 'bba'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/serenityjs',
                component: ComponentCreator('/docs/decisions/serenityjs', '060'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/test-suite',
                component: ComponentCreator('/docs/decisions/test-suite', '42a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/decisions/white-label',
                component: ComponentCreator('/docs/decisions/white-label', '281'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
