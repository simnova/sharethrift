Apollo [requires all datasources to be in a flat structure](https://www.apollographql.com/docs/apollo-server/data/data-sources/#adding-data-sources-to-apollo-server). 

To prevent name collisions, the following naming convention is used:

`<<objectType>><<dataSourceType>>API`

Exception to rule: For the default dataSource the objectType is omitted for brevity.