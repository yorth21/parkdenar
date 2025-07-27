import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { initialRates } from "@/db/schema";

export async function findInitialRateById(id: number) {
	const [row] = await db
		.select()
		.from(initialRates)
		.where(eq(initialRates.id, id))
		.limit(1);
	return row || null;
}

export async function findCurrentInitialRateByVehicleType(
	vehicleTypeId: number,
	date: Date = new Date(),
) {
	const timestamp = date.getTime();

	const [row] = await db
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
	return row || null;
}
