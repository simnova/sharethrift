The domain datasource is a simple data source that is used for manipulating the domain model in a manner which ensures  the domain model is always in a consistent state.

Resources to learn more about custom data sources:

https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/


Testing leverages mongodb-memory-server to test the anti-corruption of the domain model.

Tests:
npm i -D mongodb-memory-server