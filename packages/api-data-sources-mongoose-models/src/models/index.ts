import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { createReservationRequestModel } from './reservation-request/index.ts';

export const mongooseContextBuilder = (
	mongooseFactory: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		ReservationRequestModel: createReservationRequestModel(mongooseFactory),
	};
};

export * from './reservation-request/index.ts';
/*
export type MongooseContext = ReturnType<typeof mongooseContextBuilder>;

Community.CommunityModel.findById('123').then((doc) => {
  doc?.whiteLabelDomain
  doc?.createdBy
});

let x = mongooseContextBuilder(null as any).Community.Community;
x.findById('123').then((doc) => {
  doc?.whiteLabelDomain
  doc?.createdBy
  console.log(doc);
});

*/
