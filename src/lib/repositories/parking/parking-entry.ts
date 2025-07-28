import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { parkingEntries } from "@/db/schema";
import type { ParkingEntry } from "@/lib/types/parking-schema";

export async function createParkingEntry(entry: Omit<ParkingEntry, "id">) {
	try {
		const newEntry = await db.insert(parkingEntries).values(entry).returning();
		return { ok: true, data: newEntry[0] };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findParkingEntryById(id: number) {
	try {
		const [entry] = await db
			.select()
			.from(parkingEntries)
			.where(eq(parkingEntries.id, id))
			.limit(1);

		if (!entry) {
			return {
				ok: false,
				error: `No se encontró la entrada para el ID ${id}`,
			};
		}

		return { ok: true, data: entry };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

// Obtener entrada activa por placa
export async function findActiveParkingEntryByPlate(plate: string) {
	try {
		const [entry] = await db
			.select()
			.from(parkingEntries)
			.where(
				and(
					eq(parkingEntries.plate, plate.toUpperCase()),
					eq(parkingEntries.status, "Open"),
				),
			)
			.limit(1);

		if (!entry) {
			return {
				ok: false,
				error: `No se encontró la entrada para la placa ${plate}`,
			};
		}

		return { ok: true, data: entry };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

// Verificar si existe una entrada activa para la placa
export async function hasActiveParkingEntry(plate: string) {
	const entry = await findActiveParkingEntryByPlate(plate);
	return entry.ok;
}
