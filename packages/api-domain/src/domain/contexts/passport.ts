
export interface Passport {
  user: {
    id: string;
    email: string;
    name?: string;
    roles?: string[];
  } | null;
  isAuthenticated: boolean;
}
