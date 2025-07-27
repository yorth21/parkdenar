import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { bands } from "@/db/schema";

export const findBandById = async (id: number) => {
	try {
		const [band] = await db
			.select()
			.from(bands)
			.where(eq(bands.id, id))
			.limit(1);
		return { ok: true, data: band || null };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};

export const findAllActiveBands = async () => {
	try {
		const listBands = await db
			.select()
			.from(bands)
			.where(eq(bands.isActive, 1));
		return { ok: true, data: listBands };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};

export const findActiveBandByHour = async (hour: number) => {
	try {
		const [band] = await db
			.select()
			.from(bands)
			.where(
				and(
					eq(bands.isActive, 1),
					lte(bands.startHour, hour),
					gte(bands.endHour, hour),
				),
			)
			.limit(1);
		return { ok: true, data: band || null };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};
