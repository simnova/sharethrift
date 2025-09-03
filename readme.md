

VSCode Extensions Required:

Azurite - used for storage emulation


Ideas:

VSCode Sorter Plugin
https://marketplace.visualstudio.com/items?itemName=aljazsim.tsco

Decisions:

Use [TSConfig Bases](https://github.com/tsconfig/bases) for TS Configuration


Begin

nvm install v20
nvm install-latest-npm

nvm use v20
npm run clean
npm install
npm run build

Startup:

nvm use v20
npm run start



Recipe:

npm i -D concurrently


npm init -w ./packages/api-graphql
npm install @as-integrations/azure-functions @apollo/server graphql @azure/functions -w api-graphql

npm init -w ./packages/api-event-handler

npm init -w ./packages/api-services
npm init -w ./packages/api-rest
npm install @azure/functions -w api-rest

npm init -w ./packages/api-data-sources-domain


npm init -w ./packages/service-otel
npm install @azure/monitor-opentelemetry -w service-otel



npm init -w ./packages/api-persistence


npm init -w ./packages/event-bus-seedwork-node



npm install --save-dev @tsconfig/node20
npm install --save-dev @tsconfig/node-ts
npm install --save-dev vitest @vitest/coverage-v8

## Your feedback matters!

Do you find Sharethrift useful? [Give it a ⭐ star on GitHub](https://github.com/simnova/sharethrift)!

[![GitHub stars](https://img.shields.io/github/stars/simnova/sharethrift)](https://github.com/simnova/sharethrift)

Found a bug? Need a feature? Raise [an issue](https://github.com/simnova/sharethrift/issues?state=open)
or submit a pull request.

Have feedback? Leave a comment in [ShareThrift discussions on GitHub](https://github.com/simnova/sharethrift/discussions)

## Project Status

[![Build Status](https://dev.azure.com/simnova/ShareThrift/_apis/build/status%2FShareThrift?branchName=refs%2Fpull%2F120%2Fmerge)](https://dev.azure.com/simnova/ShareThrift/_build/latest?definitionId=13&branchName=refs%2Fpull%2F120%2Fmerge)


## Thanks to all our contributitors

[![sharethrift contributors](https://contrib.rocks/image?repo=simnova/sharethrift)](https://github.com/simnova/sharethrift/graphs/contributors)

[⬆ Back to Top](#table-of-contents)
