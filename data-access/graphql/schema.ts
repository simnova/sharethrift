import {typeDefs} from './typedefs/index'
import * as resolvers from './resolvers/index'
import { makeExecutableSchema } from '@graphql-tools/schema'

export default makeExecutableSchema({
    typeDefs: typeDefs(),
    resolvers: resolvers
})

