import { user } from './user';
import { users } from './users';
import { categories } from './categories';

export const queries = {
    ...user.Query,
    ...users.Query,
    ...categories.Query
};