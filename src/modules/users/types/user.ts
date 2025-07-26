export type CreateUserInput = {
	name?: string;
	email: string;
	password: string;
	role?: string;
	image?: string;
};

export type UpdateUserInput = {
	name?: string;
	email?: string;
	password?: string;
	role?: string;
	image?: string;
	isActive?: boolean;
};
