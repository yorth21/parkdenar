export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	role: string;
	emailVerified: Date | null;
	image: string | null;
	isActive: boolean;
}

export interface Account {
	userId: string;
	type: string;
	provider: string;
	providerAccountId: string;
	refresh_token: string | null;
	access_token: string | null;
	expires_at: number | null;
	token_type: string | null;
	scope: string | null;
	id_token: string | null;
	session_state: string | null;
}

export interface Session {
	sessionToken: string;
	userId: string;
	expires: Date;
}

export interface VerificationToken {
	identifier: string;
	token: string;
	expires: Date;
}

export interface Authenticator {
	credentialID: string;
	userId: string;
	providerAccountId: string;
	credentialPublicKey: string;
	counter: number;
	credentialDeviceType: string;
	credentialBackedUp: boolean;
	transports: string | null;
}
