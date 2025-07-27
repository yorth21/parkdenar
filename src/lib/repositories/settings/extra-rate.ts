import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { extraRates } from "@/db/schema";

export const findCurrentExtraRate = async (
	bandId: number,
	vehicleTypeId: number,
	date: Date = new Date(),
) => {
	try {
		const timestamp = date.getTime();

		const [extraRate] = await db
			.select()
			.from(extraRates)
			.where(
				and(
					eq(extraRates.bandId, bandId),
					eq(extraRates.vehicleTypeId, vehicleTypeId),
					sql`${extraRates.validFrom} <= ${timestamp}`,
					or(
						isNull(extraRates.validTo),
						sql`${extraRates.validTo} >= ${timestamp}`,
					),
				),
			)
			.orderBy(desc(extraRates.validFrom))
			.limit(1);
		return { ok: true, data: extraRate || null };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};
