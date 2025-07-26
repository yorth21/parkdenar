import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

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

export class UserRepository {
	// Crear usuario
	static async create(input: CreateUserInput) {
		const [user] = await db.insert(users).values(input).returning();
		return user;
	}

	// Obtener usuario por ID
	static async findById(id: string) {
		return db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener usuario por email
	static async findByEmail(email: string) {
		return db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener usuario por email y activo
	static async findActiveByEmail(email: string) {
		return db
			.select()
			.from(users)
			.where(and(eq(users.email, email), eq(users.isActive, true)))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener todos los usuarios
	static async findAll() {
		return db.select().from(users);
	}

	// Obtener usuarios activos
	static async findAllActive() {
		return db.select().from(users).where(eq(users.isActive, true));
	}

	// Obtener usuarios por rol
	static async findByRole(role: string) {
		return db.select().from(users).where(eq(users.role, role));
	}

	// Actualizar usuario
	static async update(id: string, input: UpdateUserInput) {
		const [updatedUser] = await db
			.update(users)
			.set(input)
			.where(eq(users.id, id))
			.returning();
		return updatedUser;
	}

	// Desactivar usuario (soft delete)
	static async deactivate(id: string) {
		return UserRepository.update(id, { isActive: false });
	}

	// Activar usuario
	static async activate(id: string) {
		return UserRepository.update(id, { isActive: true });
	}

	// Eliminar usuario (hard delete)
	static async delete(id: string) {
		const [deletedUser] = await db
			.delete(users)
			.where(eq(users.id, id))
			.returning();
		return deletedUser;
	}

	// Verificar si existe un usuario por email
	static async existsByEmail(email: string) {
		const user = await UserRepository.findByEmail(email);
		return !!user;
	}

	// Contar usuarios por rol
	static async countByRole(role: string) {
		const result = await db
			.select({ count: sql<number>`count(*)` })
			.from(users)
			.where(eq(users.role, role));
		return result[0]?.count || 0;
	}
}
