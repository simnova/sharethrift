import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export const mongooseContextBuilder = (
	_: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
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
