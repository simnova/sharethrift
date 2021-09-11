const { typeDefs } = require('graphql-scalars');
const { buildSchema } = require('graphql');

const scalars = typeDefs.join('\n')

module.exports = buildSchema(scalars);