import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { initialRates, vehicleTypes } from "@/db/schema";
import type { CreateInitialRateInput } from "@/types/initial-rate";

export async function createInitialRate(input: CreateInitialRateInput) {
	const [initialRate] = await db.insert(initialRates).values(input).returning();
	return initialRate;
}

export async function findInitialRateById(id: number) {
	const [row] = await db
		.select()
		.from(initialRates)
		.where(eq(initialRates.id, id))
		.limit(1);
	return row || null;
}

export async function findAllInitialRates() {
	return db
		.select({
			id: initialRates.id,
			vehicleTypeId: initialRates.vehicleTypeId,
			amount: initialRates.amount,
			validFrom: initialRates.validFrom,
			validTo: initialRates.validTo,
			vehicleTypeName: vehicleTypes.name,
		})
		.from(initialRates)
		.leftJoin(vehicleTypes, eq(initialRates.vehicleTypeId, vehicleTypes.id));
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

export async function findInitialRatesByVehicleType(vehicleTypeId: number) {
	return db
		.select()
		.from(initialRates)
		.where(eq(initialRates.vehicleTypeId, vehicleTypeId))
		.orderBy(desc(initialRates.validFrom));
}

export async function deactivateInitialRate(id: number) {
	return db
		.update(initialRates)
		.set({ validTo: new Date() })
		.where(eq(initialRates.id, id));
}

export async function getCurrentInitialRateAmount(
	vehicleTypeId: number,
	date: Date = new Date(),
) {
	const rate = await findCurrentInitialRateByVehicleType(vehicleTypeId, date);
	return rate?.amount ?? 0;
}
