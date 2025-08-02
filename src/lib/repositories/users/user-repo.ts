import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { User } from "@/lib/types/auth-schema";
import type { RepositoryResponse } from "@/lib/types/response-actions";

export const findUserByEmail = async (
	email: string,
): Promise<RepositoryResponse<User>> => {
	try {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (!user) {
			return { ok: false, error: "Usuario no encontrado" };
		}

		return { ok: true, data: user as User };
	} catch (error) {
		return { ok: false, error };
	}
};

export const findAllUsers = async (): Promise<
	RepositoryResponse<Omit<User, "password">[]>
> => {
	try {
		const listUsers = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				emailVerified: users.emailVerified,
				image: users.image,
				isActive: users.isActive,
			})
			.from(users)
			.orderBy(users.role);

		return { ok: true, data: listUsers as Omit<User, "password">[] };
	} catch (error) {
		return { ok: false, error };
	}
};
