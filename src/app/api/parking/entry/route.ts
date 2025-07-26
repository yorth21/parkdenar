import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { registerEntry } from "@/modules/parking/services/parking-service";

export async function POST(request: NextRequest) {
	try {
		// Obtener sesión del usuario
		const session = await auth();
		console.log({ session });
		if (!session?.user?.id) {
			return NextResponse.json({ error: "No autorizado" }, { status: 401 });
		}

		const body = await request.json();
		const { plate, vehicleTypeId } = body;

		// Validar datos requeridos
		if (!plate || typeof plate !== "string" || plate.trim() === "") {
			return NextResponse.json(
				{ error: "La placa es requerida" },
				{ status: 400 },
			);
		}

		if (!vehicleTypeId || typeof vehicleTypeId !== "number") {
			return NextResponse.json(
				{ error: "El tipo de vehículo es requerido" },
				{ status: 400 },
			);
		}

		console.log({
			plate,
			vehicleTypeId,
			userId: session.user.id,
		});

		// Registrar entrada
		const result = await registerEntry({
			plate: plate.trim(),
			vehicleTypeId,
			userId: session.user.id,
		});

		console.log({ result });
		if (!result.success) {
			return NextResponse.json({ error: result.message }, { status: 400 });
		}

		return NextResponse.json(result, { status: 201 });
	} catch (error) {
		console.error("Error registrando entrada:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
