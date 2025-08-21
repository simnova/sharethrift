import type { Contexts } from './domain/index.ts';
export * as Domain from './domain/index.ts';

export interface DomainDataSource {
	User: {
		PersonalUser: {
			PersonalUserUnitOfWork: Contexts.User.PersonalUser.PersonalUserUnitOfWork;
		};
	};

  Listing: {
      Item?: {
        ListingItemUnitOfWork: Contexts.User.PersonalUser.PersonalUserUnitOfWork;
      };
    }
  
}
