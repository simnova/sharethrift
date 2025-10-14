import type { UserVisa } from './user.visa.js';
import type { PersonalUserEntityReference } from './personal-user/personal-user.entity.js';

export interface UserPassport {
	forPersonalUser(root: PersonalUserEntityReference): UserVisa;
}
