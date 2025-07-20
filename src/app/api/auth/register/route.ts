import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		// Validar datos
		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: "Todos los campos son requeridos" },
				{ status: 400 },
			);
		}

		if (password.length < 6) {
			return NextResponse.json(
				{ error: "La contraseña debe tener al menos 6 caracteres" },
				{ status: 400 },
			);
		}

		// Verificar si el usuario ya existe
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existingUser.length > 0) {
			return NextResponse.json(
				{ error: "El usuario ya existe con este email" },
				{ status: 400 },
			);
		}

		// Hash de la contraseña
		const hashedPassword = await bcrypt.hash(password, 12);

		// Crear usuario
		const newUser = await db
			.insert(users)
			.values({
				name,
				email,
				password: hashedPassword,
			})
			.returning();

		return NextResponse.json(
			{ message: "Usuario creado exitosamente", userId: newUser[0].id },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error al crear usuario:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
