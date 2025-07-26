import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { bands } from "@/db/schema";
import type {
	CreateBandInput,
	UpdateBandInput,
} from "@/modules/settings/types/band";

export const createBand = async (input: CreateBandInput) => {
	const [band] = await db.insert(bands).values(input).returning();
	return band;
};

export const findBandById = async (id: number) => {
	return db
		.select()
		.from(bands)
		.where(eq(bands.id, id))
		.limit(1)
		.then((rows) => rows[0] || null);
};

export const findBandByName = async (name: string) => {
	return db
		.select()
		.from(bands)
		.where(eq(bands.name, name))
		.limit(1)
		.then((rows) => rows[0] || null);
};

export const findAllBands = async () => {
	return db.select().from(bands);
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

export const findOverlappingBands = async (
	startHour: number,
	endHour: number,
) => {
	return db
		.select()
		.from(bands)
		.where(
			and(
				eq(bands.isActive, 1),
				sql`NOT (${bands.endHour} <= ${startHour} OR ${bands.startHour} >= ${endHour})`,
			),
		);
};

export const updateBand = async (id: number, input: UpdateBandInput) => {
	const [updatedBand] = await db
		.update(bands)
		.set(input)
		.where(eq(bands.id, id))
		.returning();
	return updatedBand;
};

export const deactivateBand = async (id: number) => {
	return updateBand(id, { isActive: 0 });
};

export const activateBand = async (id: number) => {
	return updateBand(id, { isActive: 1 });
};

export const existsBandByName = async (name: string) => {
	const band = await findBandByName(name);
	return !!band;
};

export const countActive = async () => {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(bands)
		.where(eq(bands.isActive, 1));
	return result[0]?.count || 0;
};

export const isActiveBand = async (id: number) => {
	const band = await findBandById(id);
	return band?.isActive === 1;
};

export const hasOverlapBands = async (
	startHour: number,
	endHour: number,
	excludeId?: number,
) => {
	const conditions = [
		eq(bands.isActive, 1),
		sql`NOT (${bands.endHour} <= ${startHour} OR ${bands.startHour} >= ${endHour})`,
	];

	if (excludeId) {
		conditions.push(sql`${bands.id} != ${excludeId}`);
	}

	const overlapping = await db
		.select()
		.from(bands)
		.where(and(...conditions));

	return overlapping.length > 0;
};

export const findAllActiveBandsOrderByStartHour = async () => {
	return db
		.select()
		.from(bands)
		.where(eq(bands.isActive, 1))
		.orderBy(bands.startHour);
};

export const boolToNumberBand = (value: boolean): number => {
	return value ? 1 : 0;
};

export const numberToBoolBand = (value: number): boolean => {
	return value === 1;
};
