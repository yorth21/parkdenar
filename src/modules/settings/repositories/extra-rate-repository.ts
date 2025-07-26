import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { bands, extraRates, vehicleTypes } from "@/db/schema";
import type { CreateExtraRateInput } from "@/modules/settings/types/extra-rate";

export const createExtraRate = async (input: CreateExtraRateInput) => {
	const [extraRate] = await db.insert(extraRates).values(input).returning();
	return extraRate;
};

export const findAllExtraRates = async () => {
	return db
		.select({
			bandId: extraRates.bandId,
			vehicleTypeId: extraRates.vehicleTypeId,
			amount: extraRates.amount,
			validFrom: extraRates.validFrom,
			validTo: extraRates.validTo,
			bandName: bands.name,
			vehicleTypeName: vehicleTypes.name,
		})
		.from(extraRates)
		.leftJoin(bands, eq(extraRates.bandId, bands.id))
		.leftJoin(vehicleTypes, eq(extraRates.vehicleTypeId, vehicleTypes.id));
};

export const findCurrentExtraRate = async (
	bandId: number,
	vehicleTypeId: number,
	date: Date = new Date(),
) => {
	const timestamp = date.getTime();

	const [row] = await db
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
	return row || null;
};

export const findExtraRatesByBand = async (bandId: number) => {
	return db
		.select({
			bandId: extraRates.bandId,
			vehicleTypeId: extraRates.vehicleTypeId,
			amount: extraRates.amount,
			validFrom: extraRates.validFrom,
			validTo: extraRates.validTo,
			vehicleTypeName: vehicleTypes.name,
		})
		.from(extraRates)
		.leftJoin(vehicleTypes, eq(extraRates.vehicleTypeId, vehicleTypes.id))
		.where(eq(extraRates.bandId, bandId))
		.orderBy(desc(extraRates.validFrom));
};

export const findExtraRatesByVehicleType = async (vehicleTypeId: number) => {
	return db
		.select({
			bandId: extraRates.bandId,
			vehicleTypeId: extraRates.vehicleTypeId,
			amount: extraRates.amount,
			validFrom: extraRates.validFrom,
			validTo: extraRates.validTo,
			bandName: bands.name,
		})
		.from(extraRates)
		.leftJoin(bands, eq(extraRates.bandId, bands.id))
		.where(eq(extraRates.vehicleTypeId, vehicleTypeId))
		.orderBy(desc(extraRates.validFrom));
};

export const findAllCurrentExtraRates = async (date: Date = new Date()) => {
	const timestamp = date.getTime();

	return db
		.select({
			bandId: extraRates.bandId,
			vehicleTypeId: extraRates.vehicleTypeId,
			amount: extraRates.amount,
			validFrom: extraRates.validFrom,
			validTo: extraRates.validTo,
			bandName: bands.name,
			vehicleTypeName: vehicleTypes.name,
		})
		.from(extraRates)
		.leftJoin(bands, eq(extraRates.bandId, bands.id))
		.leftJoin(vehicleTypes, eq(extraRates.vehicleTypeId, vehicleTypes.id))
		.where(
			and(
				sql`${extraRates.validFrom} <= ${timestamp}`,
				or(
					isNull(extraRates.validTo),
					sql`${extraRates.validTo} >= ${timestamp}`,
				),
			),
		);
};

export const deactivateExtraRate = async (
	bandId: number,
	vehicleTypeId: number,
	validFrom: Date,
) => {
	return db
		.update(extraRates)
		.set({ validTo: new Date() })
		.where(
			and(
				eq(extraRates.bandId, bandId),
				eq(extraRates.vehicleTypeId, vehicleTypeId),
				eq(extraRates.validFrom, validFrom),
			),
		);
};

export const getCurrentExtraRateAmount = async (
	bandId: number,
	vehicleTypeId: number,
	date: Date = new Date(),
) => {
	const rate = await findCurrentExtraRate(bandId, vehicleTypeId, date);
	return rate?.amount || 0;
};

export const existsExtraRate = async (
	bandId: number,
	vehicleTypeId: number,
) => {
	const [row] = await db
		.select({ bandId: extraRates.bandId })
		.from(extraRates)
		.where(
			and(
				eq(extraRates.bandId, bandId),
				eq(extraRates.vehicleTypeId, vehicleTypeId),
			),
		)
		.limit(1);
	return !!row;
};

export const countActiveExtraRates = async (date: Date = new Date()) => {
	const timestamp = date.getTime();

	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(extraRates)
		.where(
			and(
				sql`${extraRates.validFrom} <= ${timestamp}`,
				or(
					isNull(extraRates.validTo),
					sql`${extraRates.validTo} >= ${timestamp}`,
				),
			),
		);
	return result[0]?.count || 0;
};
