import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { createItemListingModel } from './item-listing/index.ts';

export const mongooseContextBuilder = (
	mongooseFactory: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		ItemListingModel: createItemListingModel(mongooseFactory),
	};
};

export * from './item-listing/index.ts';
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
