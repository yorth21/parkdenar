import { eq } from "drizzle-orm";
import { db } from "@/db";
import { vehicleTypes } from "@/db/schema";

export async function findVehicleTypeById(id: number) {
	const [row] = await db
		.select()
		.from(vehicleTypes)
		.where(eq(vehicleTypes.id, id))
		.limit(1);
	return row || null;
}

export async function findAllActiveVehicleTypes() {
	return db.select().from(vehicleTypes).where(eq(vehicleTypes.isActive, 1));
}
