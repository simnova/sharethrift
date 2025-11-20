import type { UserVisa } from './user.visa.ts';
import type { PersonalUserEntityReference } from './personal-user/personal-user.entity.ts';
import type { AdminUserEntityReference } from './admin-user/admin-user.entity.ts';

export interface UserPassport {
	forPersonalUser(root: PersonalUserEntityReference): UserVisa;
    forAdminUser(root: AdminUserEntityReference): UserVisa;
}
