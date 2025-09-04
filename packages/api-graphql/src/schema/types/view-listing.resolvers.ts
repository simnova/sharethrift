// import type { ApplicationServices } from '@sthrift/api-application-services';
// import type { DomainDataSource } from '@sthrift/api-domain';

// // GraphContext defined inline (current index.ts builds context with applicationServices only)
// interface GraphContext {
//   applicationServices: ApplicationServices;
// }

// interface ItemListingLike {
//   id: string;
//   title?: { valueOf(): string } | string;
//   description?: { valueOf(): string } | string;
//   category?: { valueOf(): string } | string;
//   location?: { valueOf(): string } | string;
//   sharingPeriodStart?: Date;
//   sharingPeriodEnd?: Date;
//   state?: { valueOf(): string } | string;
//   images?: readonly string[];
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// function mapListing(domain: ItemListingLike | undefined | null) {
//   if (!domain) return null;
//   const asString = (val: unknown): string => {
//     if (val === null || val === undefined) return '';
//     if (typeof val === 'string') return val;
//     if (typeof (val as { valueOf?: () => unknown }).valueOf === 'function') {
//       const v = (val as { valueOf: () => unknown }).valueOf();
//       return typeof v === 'string' ? v : '';
//     }
//     return '';
//   };
//   return {
//     id: domain.id,
//     title: asString(domain.title),
//     description: asString(domain.description),
//     category: asString(domain.category),
//     location: asString(domain.location),
//     sharingPeriodStart: domain.sharingPeriodStart?.toISOString?.() ?? null,
//     sharingPeriodEnd: domain.sharingPeriodEnd?.toISOString?.() ?? null,
//     state: asString(domain.state),
//   images: Array.isArray(domain.images) ? [...domain.images] : [],
//     createdAt: domain.createdAt?.toISOString?.() ?? null,
//     updatedAt: domain.updatedAt?.toISOString?.() ?? null,
//   };
// }

// function getDomainDataSource(context: GraphContext): DomainDataSource | undefined {
//   // applicationServices currently exposes domainDataSource directly
//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   return (context.applicationServices as unknown as { domainDataSource?: DomainDataSource }).domainDataSource;
// }

// export const resolvers = {
//   Query: {
//     viewListing: async (_parent: unknown, { id }: { id: string }, context: GraphContext) => {
//       const domainDataSource = getDomainDataSource(context);
//       if (!domainDataSource?.domainContexts.listing?.item) {
//         throw new Error('Listing data source not available');
//       }
//       const uowFactory = domainDataSource.domainContexts.listing.item.getItemListingUnitOfWork;
//       const uow = uowFactory();
//       const listing = await uow.itemListingRepository.getById(id);
//       if (!listing) {
//         return null; // GraphQL will return null for not found
//       }
//       return mapListing(listing);
//     },
//   },
// };
