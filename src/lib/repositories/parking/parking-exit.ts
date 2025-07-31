import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parkingExit } from "@/db/schema";
import type {
	ParkingExit,
	ParkingExitStatus,
} from "@/lib/types/parking-schema";

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

		if (!exit) {
			return {
				ok: false,
				error: `No se encontró la salida para el ID ${id}`,
			};
		}

		return { ok: true, data: exit };
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

		if (!exit) {
			return {
				ok: false,
				error: `No se encontró la salida para el ID de entrada ${entryId}`,
			};
		}
		return { ok: true, data: exit };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function updateParkingExitStatus(
	id: number,
	status: ParkingExitStatus,
) {
	try {
		await db
			.update(parkingExit)
			.set({ status })
			.where(eq(parkingExit.id, id))
			.returning();
	} catch (err: unknown) {
		throw new Error(
			`Error al actualizar el estado de la salida ${id} a ${status}: ${err}`,
		);
	}
}
