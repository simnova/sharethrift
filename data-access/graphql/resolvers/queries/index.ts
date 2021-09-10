import { getUser } from './get-user';
import { getUsers } from './get-users';
import { getCategories } from './get-categories';

export const queries = {
    ...getUser.Query,
    ...getUsers.Query,
    ...getCategories.Query
};