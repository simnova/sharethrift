export interface UserProfileData {
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
