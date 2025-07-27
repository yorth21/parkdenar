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
		return { ok: true, data: initialRate || null };
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
		return { ok: true, data: initialRate || null };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}
