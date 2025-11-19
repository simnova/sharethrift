import type { Passport } from '../../passport.ts';
import type { AppealRequestVisa } from '../appeal-request.visa.ts';
import * as ValueObjects from './user-appeal-request.value-objects.ts';
import type {
	UserAppealRequestEntityReference,
	UserAppealRequestProps,
} from './user-appeal-request.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import { AppealRequestBase } from '../base-appeal-request.ts';

export class UserAppealRequest<props extends UserAppealRequestProps>
	extends AppealRequestBase<props>
	implements UserAppealRequestEntityReference
{
	protected createVisa(passport: Passport): AppealRequestVisa {
		return passport.appealRequest.forUserAppealRequest(this);
	}

	public static getNewInstance<props extends UserAppealRequestProps>(
		newProps: props,
		passport: Passport,
		userId: string,
		reason: string,
		blockerId: string,
	): UserAppealRequest<props> {
		const newInstance = new UserAppealRequest(newProps, passport);

		newInstance.props.user = { id: userId } as PersonalUserEntityReference;
		newInstance.reason = reason;
		newInstance.props.state = ValueObjects.AppealRequestState.REQUESTED;
		newInstance.props.type = ValueObjects.AppealRequestType.USER;
		newInstance.props.blocker = { id: blockerId } as PersonalUserEntityReference;

		return newInstance;
	}
}
