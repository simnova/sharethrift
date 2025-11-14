export * as PersonalUser from './personal-user/index.ts';
export * as AdminUser from './admin-user/index.ts';

// User union type - accepts either PersonalUser or AdminUser
import type { PersonalUserEntityReference } from './personal-user/personal-user.entity.ts';
import type { AdminUserEntityReference } from './admin-user/admin-user.entity.ts';

export type UserEntityReference =
	| PersonalUserEntityReference
	| AdminUserEntityReference;
