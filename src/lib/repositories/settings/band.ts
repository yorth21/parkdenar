import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { bands } from "@/db/schema";

export const findBandById = async (id: number) => {
	return db
		.select()
		.from(bands)
		.where(eq(bands.id, id))
		.limit(1)
		.then((rows) => rows[0] || null);
};

export const findAllActiveBands = async () => {
	return db.select().from(bands).where(eq(bands.isActive, 1));
};

export const findActiveBandByHour = async (hour: number) => {
	return db
		.select()
		.from(bands)
		.where(
			and(
				eq(bands.isActive, 1),
				lte(bands.startHour, hour),
				gte(bands.endHour, hour),
			),
		)
		.limit(1)
		.then((rows) => rows[0] || null);
};

export const isActiveBand = async (id: number) => {
	const band = await findBandById(id);
	return band?.isActive === 1;
};
