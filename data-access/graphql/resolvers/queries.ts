import { getUser } from './queryies/get-user';
import { getCategories } from './queryies/get-categories';

const Query = 
    getUser.Query &&
    getCategories.Query;




export default {
    Query
}