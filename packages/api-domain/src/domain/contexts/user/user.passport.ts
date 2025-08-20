import type { UserVisa } from './user.visa.ts';
import type { PersonalUserEntityReference } from './personal-user/personal-user.ts';

export interface UserPassport {
	forPersonalUser(root: PersonalUserEntityReference): UserVisa;
}
