import {createCategory} from './create-category';
import {updateUser} from './update-user';
import {createUser} from './create-user';

export const mutations = {
    ...updateUser.Mutation,
    ...createUser.Mutation,
    ...createCategory.Mutation
}