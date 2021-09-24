/* ensure these remain as require statements as they get called from graphql-code-generator */
const { typeDefs } = require('graphql-scalars');
const { buildSchema } = require('graphql');

const scalars = typeDefs.join('\n')

module.exports = buildSchema(scalars);