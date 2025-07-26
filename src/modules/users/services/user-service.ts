import type { CreateUserInput, UpdateUserInput } from "@/repositories";
import { UserRepository } from "@/repositories";

export type AuthResult = {
	success: boolean;
	message: string;
	user?: {
		id: string;
		name: string | null;
		email: string | null;
		role: string;
	};
};

export type UserCreationResult = {
	success: boolean;
	message: string;
	userId?: string;
};

export class UserService {
	// Crear nuevo usuario con validaciones
	static async createUser(input: CreateUserInput): Promise<UserCreationResult> {
		try {
			// 1. Validar datos de entrada
			const validation = UserService.validateUserInput(input);
			if (!validation.isValid) {
				return {
					success: false,
					message: validation.message,
				};
			}

			// 2. Verificar que el email no exista
			const existingUser = await UserRepository.findByEmail(input.email);
			if (existingUser) {
				return {
					success: false,
					message: "Ya existe un usuario con este email",
				};
			}

			// 3. Hash de la contraseña (TODO: implementar bcrypt)
			const hashedPassword = await UserService.hashPassword(input.password);

			// 4. Crear usuario
			const user = await UserRepository.create({
				...input,
				password: hashedPassword,
			});

			return {
				success: true,
				message: "Usuario creado exitosamente",
				userId: user.id,
			};
		} catch (error) {
			console.error("Error creando usuario:", error);
			return {
				success: false,
				message: "Error interno del servidor",
			};
		}
	}

	// Autenticar usuario
	static async authenticateUser(
		email: string,
		password: string,
	): Promise<AuthResult> {
		try {
			// 1. Buscar usuario activo
			const user = await UserRepository.findActiveByEmail(email);
			if (!user) {
				return {
					success: false,
					message: "Credenciales inválidas",
				};
			}

			// 2. Verificar contraseña (TODO: implementar bcrypt)
			const isValidPassword = await UserService.verifyPassword(
				password,
				user.password || "",
			);
			if (!isValidPassword) {
				return {
					success: false,
					message: "Credenciales inválidas",
				};
			}

			return {
				success: true,
				message: "Autenticación exitosa",
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			};
		} catch (error) {
			console.error("Error autenticando usuario:", error);
			return {
				success: false,
				message: "Error interno del servidor",
			};
		}
	}

	// Obtener perfil de usuario
	static async getUserProfile(userId: string) {
		try {
			const user = await UserRepository.findById(userId);
			if (!user || !user.isActive) {
				throw new Error("Usuario no encontrado o inactivo");
			}

			return {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				isActive: user.isActive,
				emailVerified: user.emailVerified,
			};
		} catch (error) {
			console.error("Error obteniendo perfil:", error);
			throw new Error("Error obteniendo perfil de usuario");
		}
	}

	// Actualizar perfil de usuario
	static async updateUserProfile(userId: string, input: UpdateUserInput) {
		try {
			// Validar que el usuario existe
			const existingUser = await UserRepository.findById(userId);
			if (!existingUser) {
				throw new Error("Usuario no encontrado");
			}

			// Si se actualiza el email, verificar que no exista
			if (input.email && input.email !== existingUser.email) {
				const emailExists = await UserRepository.existsByEmail(input.email);
				if (emailExists) {
					throw new Error("El email ya está en uso");
				}
			}

			// Si se actualiza la contraseña, hashearla
			if (input.password) {
				input.password = await UserService.hashPassword(input.password);
			}

			const updatedUser = await UserRepository.update(userId, input);

			return {
				id: updatedUser.id,
				name: updatedUser.name,
				email: updatedUser.email,
				role: updatedUser.role,
				isActive: updatedUser.isActive,
			};
		} catch (error) {
			console.error("Error actualizando usuario:", error);
			throw error;
		}
	}

	// Obtener usuarios por rol
	static async getUsersByRole(role: string) {
		try {
			return await UserRepository.findByRole(role);
		} catch (error) {
			console.error("Error obteniendo usuarios por rol:", error);
			throw new Error("Error obteniendo usuarios");
		}
	}

	// Desactivar usuario
	static async deactivateUser(userId: string, adminUserId: string) {
		try {
			// Verificar que el admin tenga permisos
			const admin = await UserRepository.findById(adminUserId);
			if (!admin || admin.role !== "admin") {
				throw new Error("Sin permisos para esta acción");
			}

			// No permitir que el admin se desactive a sí mismo
			if (userId === adminUserId) {
				throw new Error("No puedes desactivarte a ti mismo");
			}

			return await UserRepository.deactivate(userId);
		} catch (error) {
			console.error("Error desactivando usuario:", error);
			throw error;
		}
	}

	// Verificar permisos de usuario
	static async hasPermission(
		userId: string,
		requiredRole: string,
	): Promise<boolean> {
		try {
			const user = await UserRepository.findById(userId);
			if (!user || !user.isActive) {
				return false;
			}

			// Jerarquía de roles: admin > user
			const roleHierarchy = {
				admin: 2,
				user: 1,
			};

			const userLevel =
				roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
			const requiredLevel =
				roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

			return userLevel >= requiredLevel;
		} catch (error) {
			console.error("Error verificando permisos:", error);
			return false;
		}
	}

	// ========== MÉTODOS PRIVADOS/HELPERS ==========

	private static validateUserInput(input: CreateUserInput) {
		// Validar email
		if (!UserService.isValidEmail(input.email)) {
			return {
				isValid: false,
				message: "Formato de email inválido",
			};
		}

		// Validar contraseña
		if (!input.password || input.password.length < 6) {
			return {
				isValid: false,
				message: "La contraseña debe tener al menos 6 caracteres",
			};
		}

		// Validar rol
		const validRoles = ["admin", "user"];
		if (input.role && !validRoles.includes(input.role)) {
			return {
				isValid: false,
				message: "Rol no válido",
			};
		}

		return {
			isValid: true,
			message: "Validación exitosa",
		};
	}

	private static isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private static async hashPassword(password: string): Promise<string> {
		// TODO: Implementar bcrypt
		// const bcrypt = require('bcrypt');
		// return await bcrypt.hash(password, 10);

		// Por ahora retornamos la contraseña sin hashear (NO HACER EN PRODUCCIÓN)
		return password;
	}

	private static async verifyPassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		// TODO: Implementar bcrypt
		// const bcrypt = require('bcrypt');
		// return await bcrypt.compare(password, hashedPassword);

		// Por ahora comparamos directamente (NO HACER EN PRODUCCIÓN)
		return password === hashedPassword;
	}
}
