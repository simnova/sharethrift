import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { UserModelFactory } from './user.ts';

export * from './user.ts';

export const mongooseContextBuilder = (
	mongooseContextFactory: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		User: UserModelFactory(mongooseContextFactory)
	};
};
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
