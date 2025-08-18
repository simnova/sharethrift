export * from './reservation-request/reservation-request.model.ts';
export * from './conversations/index.ts';

import * as ReservationRequest from './reservation-request/reservation-request.model.ts';
import * as Conversations from './conversations/index.ts';

export const Models = {
	...ReservationRequest,
	...Conversations,
};