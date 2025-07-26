import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import type {
	CreateUserInput,
	UpdateUserInput,
} from "@/modules/users/types/user";

export async function createUser(input: CreateUserInput) {
	const [user] = await db.insert(users).values(input).returning();
	return user;
}

export async function findUserById(id: string) {
	const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
	return user || null;
}

export async function findUserByEmail(email: string) {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);
	return user || null;
}

export async function findActiveUserByEmail(email: string) {
	const [user] = await db
		.select()
		.from(users)
		.where(and(eq(users.email, email), eq(users.isActive, true)))
		.limit(1);
	return user || null;
}

export async function findAllUsers() {
	return db.select().from(users);
}

export async function findAllActiveUsers() {
	return db.select().from(users).where(eq(users.isActive, true));
}

export async function findUsersByRole(role: string) {
	return db.select().from(users).where(eq(users.role, role));
}

export async function updateUser(id: string, input: UpdateUserInput) {
	const [updatedUser] = await db
		.update(users)
		.set(input)
		.where(eq(users.id, id))
		.returning();
	return updatedUser;
}

export async function deactivateUser(id: string) {
	return updateUser(id, { isActive: false });
}

export async function activateUser(id: string) {
	return updateUser(id, { isActive: true });
}

export async function deleteUser(id: string) {
	const [deletedUser] = await db
		.delete(users)
		.where(eq(users.id, id))
		.returning();
	return deletedUser;
}

export async function existsUserByEmail(email: string) {
	const user = await findUserByEmail(email);
	return !!user;
}

export async function countUsersByRole(role: string) {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(users)
		.where(eq(users.role, role));
	return result[0]?.count || 0;
}
