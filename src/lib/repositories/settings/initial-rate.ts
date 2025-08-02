import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { initialRates } from "@/db/schema";

export async function findInitialRateById(id: number) {
	try {
		const [initialRate] = await db
			.select()
			.from(initialRates)
			.where(eq(initialRates.id, id))
			.limit(1);

		if (!initialRate) {
			return {
				ok: false,
				error: `No se encontró una tarifa inicial para el tipo de vehículo ${id}`,
			};
		}

		return { ok: true, data: initialRate };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findAllInitialRates() {
	try {
		const listInitialRates = await db.select().from(initialRates);
		return { ok: true, data: listInitialRates };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findCurrentInitialRateByVehicleType(
	vehicleTypeId: number,
	date: Date = new Date(),
) {
	try {
		const timestamp = date.getTime();

		const [initialRate] = await db
			.select()
			.from(initialRates)
			.where(
				and(
					eq(initialRates.vehicleTypeId, vehicleTypeId),
					sql`${initialRates.validFrom} <= ${timestamp}`,
					or(
						isNull(initialRates.validTo),
						sql`${initialRates.validTo} >= ${timestamp}`,
					),
				),
			)
			.orderBy(desc(initialRates.validFrom))
			.limit(1);

		if (!initialRate) {
			return {
				ok: false,
				error: "No se encontró una tarifa inicial para este tipo de vehículo",
			};
		}

		return { ok: true, data: initialRate };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}
