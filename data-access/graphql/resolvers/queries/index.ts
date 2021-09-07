import { getUser } from './get-user';
import { getCategories } from './get-categories';

export const queries = {
    ...getUser.Query,
    ...getCategories.Query
};