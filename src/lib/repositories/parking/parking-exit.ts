import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parkingExit } from "@/db/schema";
import type { ParkingExit } from "@/lib/types/parking-schema";

export async function createParkingExit(exit: Omit<ParkingExit, "id">) {
	try {
		const [newExit] = await db.insert(parkingExit).values(exit).returning();
		return { ok: true, data: newExit };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findParkingExitById(id: number) {
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
}

// Obtener salida por ID de entrada
export async function findParkingExitByEntryId(entryId: number) {
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
}
