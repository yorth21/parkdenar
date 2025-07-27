import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { parkingEntries } from "@/db/schema";

export async function findParkingEntryById(id: number) {
	const [entry] = await db
		.select()
		.from(parkingEntries)
		.where(eq(parkingEntries.id, id))
		.limit(1);
	return entry || null;
}

// Obtener entrada activa por placa
export async function findActiveParkingEntryByPlate(plate: string) {
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
	return entry || null;
}
