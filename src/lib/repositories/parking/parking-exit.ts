import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parkingExit } from "@/db/schema";

export const findParkingExitById = async (id: number) => {
	try {
		const [exit] = await db
			.select()
			.from(parkingExit)
			.where(eq(parkingExit.id, id))
			.limit(1);
		return { ok: true, data: exit || null };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};

// Obtener salida por ID de entrada
export const findParkingExitByEntryId = async (entryId: number) => {
	try {
		const [exit] = await db
			.select()
			.from(parkingExit)
			.where(eq(parkingExit.entryId, entryId))
			.limit(1);
		return { ok: true, data: exit || null };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};
