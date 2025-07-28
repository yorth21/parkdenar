import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { bands } from "@/db/schema";

export async function findBandById(id: number) {
	try {
		const [band] = await db
			.select()
			.from(bands)
			.where(eq(bands.id, id))
			.limit(1);

		if (!band) {
			return { ok: false, error: "Banda no encontrada" };
		}

		return { ok: true, data: band };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findAllActiveBands() {
	try {
		const listBands = await db
			.select()
			.from(bands)
			.where(eq(bands.isActive, 1));
		return { ok: true, data: listBands };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findActiveBandByHour(hour: number) {
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

		if (!band) {
			return { ok: false, error: "Banda no encontrada" };
		}

		return { ok: true, data: band };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}
