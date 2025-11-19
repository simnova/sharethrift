export interface UserListing {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	state?: string | null;
	images?: string[] | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	sharingPeriodStart: string;
	sharingPeriodEnd: string;
}

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
}
