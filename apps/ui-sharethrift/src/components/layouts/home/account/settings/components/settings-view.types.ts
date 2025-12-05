export interface SettingsUser {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	accountType: string;
	aboutMe?: string;
	location: {
		address1?: string;
		address2?: string;
		city?: string;
		state?: string;
		country?: string;
		zipCode?: string;
	};
	billing?: {
		subscriptionId?: string;
		cybersourceCustomerId?: string;
	};
	createdAt: string;
}

// Type for section form values - union of all possible form value shapes
export type SectionFormValues = {
	firstName?: string;
	lastName?: string;
	username?: string;
	email?: string;
	aboutMe?: string;
	accountType?: string;
	address1?: string;
	address2?: string;
	city?: string;
	state?: string;
	country?: string;
	zipCode?: string;
	subscriptionId?: string;
	cybersourceCustomerId?: string;
	currentPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
	location?: {
		address1?: string;
		address2?: string;
		city?: string;
		state?: string;
		country?: string;
		zipCode?: string;
	};
};

export interface SettingsViewProps {
	user: SettingsUser;
	onEditSection: (section: string) => void;
	onChangePassword: () => void;

	onSaveSection?: (
		section: 'profile' | 'location' | 'plan' | 'billing' | 'password',
		values: SectionFormValues,
	) => Promise<void>;
	isSavingSection?: boolean;
	mutationErrorMessage?: string;
}

// Union type for current user
type PersonalUserSettings = {
	__typename: 'PersonalUser';
	id: string;
	userType: string;
	account: {
		accountType: string;
		email: string;
		username: string;
		profile: {
			firstName: string;
			lastName: string;
			aboutMe?: string;
			location: {
				address1?: string;
				address2?: string;
				city?: string;
				state?: string;
				country?: string;
				zipCode?: string;
			};
			billing?: {
				subscriptionId?: string;
				cybersourceCustomerId?: string;
			};
		};
	};
	createdAt: string;
	updatedAt: string;
};

type AdminUserSettings = {
	__typename: 'AdminUser';
	id: string;
	userType: string;
	account: {
		accountType: string;
		email: string;
		username: string;
		profile: {
			firstName: string;
			lastName: string;
			aboutMe?: string;
			location: {
				address1?: string;
				address2?: string;
				city?: string;
				state?: string;
				country?: string;
				zipCode?: string;
			};
		};
	};
	role: {
		id: string;
		roleName: string;
	};
	createdAt: string;
	updatedAt: string;
};

export interface CurrentUserSettingsQueryData {
	currentUser: PersonalUserSettings | AdminUserSettings;
}

export interface PlanOption {
	id: string;
	name: string;
	price: string;
	features: string[];
	isSelected: boolean;
	isPopular?: boolean;
}
