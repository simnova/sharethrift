export * as Domain from './domain/index.ts';

export interface DomainDataSource {
	User: {
		PersonalUser: import('./domain/contexts/user/personal-user/personal-user.uow.ts').PersonalUserUnitOfWork;
	};
}
