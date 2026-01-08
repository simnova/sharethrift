declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ALLOWED_REDIRECT_URI?: string;
			Email?: string;
			Admin_Email?: string;
			Given_Name?: string;
			Admin_Given_Name?: string;
			Family_Name?: string;
			Admin_Family_Name?: string;
		}
	}
}

export {};
