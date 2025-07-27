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
		return { ok: true, data: vehicleType || null };
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
