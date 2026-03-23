// Keep this as CommonJS for graphql-code-generator's code-file-loader.
const { typeDefs } = require('graphql-scalars');

const schemaSDL = typeDefs.join('\n');

module.exports = {
	default: schemaSDL,
	schema: schemaSDL,
};
