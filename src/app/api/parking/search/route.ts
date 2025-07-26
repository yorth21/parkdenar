import { type NextRequest, NextResponse } from "next/server";
import { searchVehicle } from "@/modules/parking/services/parking-service";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { plate } = body;

		// Validar que la placa esté presente
		if (!plate || typeof plate !== "string" || plate.trim() === "") {
			return NextResponse.json(
				{ error: "La placa es requerida" },
				{ status: 400 },
			);
		}

		// Buscar el vehículo
		const result = await searchVehicle(plate.trim());

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Error en búsqueda de vehículo:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
