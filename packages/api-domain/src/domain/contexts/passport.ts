import type { UserPassport } from './user/user.passport.ts';
import { SystemPassport } from '../iam/index.ts';

export interface Passport {
	get user(): UserPassport;
}

export const PassportFactory = {
	forReadOnly(): Passport {
		return {} as Passport; // need to implement read only passport implementation in IAM section
	},
	forSystem(): Passport {
		return new SystemPassport();
	},
};
