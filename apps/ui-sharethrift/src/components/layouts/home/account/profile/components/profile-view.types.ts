export interface ProfileUser {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	accountType: string;
	location: {
		city: string;
		state: string;
	};
	createdAt: string;
	isBlocked?: boolean;
}
