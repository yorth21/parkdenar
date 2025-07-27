import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parkingExit } from "@/db/schema";

export const findParkingExitById = async (id: number) => {
	const [row] = await db
		.select()
		.from(parkingExit)
		.where(eq(parkingExit.id, id))
		.limit(1);
	return row || null;
};

// Obtener salida por ID de entrada
export const findParkingExitByEntryId = async (entryId: number) => {
	const [row] = await db
		.select()
		.from(parkingExit)
		.where(eq(parkingExit.entryId, entryId))
		.limit(1);
	return row || null;
};
