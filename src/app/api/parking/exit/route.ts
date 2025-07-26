import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { registerExit } from "@/modules/parking/services/parking-service";

export async function POST(request: NextRequest) {
	try {
		// Obtener sesión del usuario
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ error: "No autorizado" }, { status: 401 });
		}

		const body = await request.json();
		const { plate } = body;

		// Validar que la placa esté presente
		if (!plate || typeof plate !== "string" || plate.trim() === "") {
			return NextResponse.json(
				{ error: "La placa es requerida" },
				{ status: 400 },
			);
		}

		// Registrar salida
		const result = await registerExit({
			plate: plate.trim(),
			userId: session.user.id,
		});

		if (!result.success) {
			return NextResponse.json({ error: result.message }, { status: 400 });
		}

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Error registrando salida:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
