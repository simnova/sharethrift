import type { BaseAppealRequestProps } from '../base-appeal-request.entity.ts';

export interface UserAppealRequestProps extends BaseAppealRequestProps {}

export interface UserAppealRequestEntityReference
	extends Readonly<UserAppealRequestProps> {}
