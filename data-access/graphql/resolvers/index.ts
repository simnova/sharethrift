import {queries} from './queries/';
import {mutations} from './mutations/';
import {Resolvers} from '../generated';

export const resolvers: Resolvers = {
    Query: queries,
    Mutation: mutations
};