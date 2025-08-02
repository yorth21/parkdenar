import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vehicleTypes } from "@/db/schema";

export async function findVehicleTypeById(id: number) {
	try {
		const [vehicleType] = await db
			.select()
			.from(vehicleTypes)
			.where(eq(vehicleTypes.id, id))
			.limit(1);

		if (!vehicleType) {
			return {
				ok: false,
				error: `No se encontró el tipo de vehículo para el ID ${id}`,
			};
		}

		return { ok: true, data: vehicleType };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findAllVehicleTypes() {
	try {
		const listVehicleTypes = await db.select().from(vehicleTypes);
		return { ok: true, data: listVehicleTypes };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findAllActiveVehicleTypes() {
	try {
		const listVehicleTypes = await db
			.select()
			.from(vehicleTypes)
			.where(eq(vehicleTypes.isActive, 1));
		return { ok: true, data: listVehicleTypes };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}
