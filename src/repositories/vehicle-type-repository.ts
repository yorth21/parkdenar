import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { vehicleTypes } from "@/db/schema";
import type {
	CreateVehicleTypeInput,
	UpdateVehicleTypeInput,
} from "@/types/vehicle-type";

export async function createVehicleType(input: CreateVehicleTypeInput) {
	const [vehicleType] = await db.insert(vehicleTypes).values(input).returning();
	return vehicleType;
}

export async function findVehicleTypeById(id: number) {
	const [row] = await db
		.select()
		.from(vehicleTypes)
		.where(eq(vehicleTypes.id, id))
		.limit(1);
	return row || null;
}

export async function findVehicleTypeByName(name: string) {
	const [row] = await db
		.select()
		.from(vehicleTypes)
		.where(eq(vehicleTypes.name, name))
		.limit(1);
	return row || null;
}

export async function findAllVehicleTypes() {
	return db.select().from(vehicleTypes);
}

export async function findAllActiveVehicleTypes() {
	return db.select().from(vehicleTypes).where(eq(vehicleTypes.isActive, 1));
}

export async function updateVehicleType(
	id: number,
	input: UpdateVehicleTypeInput,
) {
	const [updatedVehicleType] = await db
		.update(vehicleTypes)
		.set(input)
		.where(eq(vehicleTypes.id, id))
		.returning();
	return updatedVehicleType;
}

export async function deactivateVehicleType(id: number) {
	return updateVehicleType(id, { isActive: 0 });
}

export async function activateVehicleType(id: number) {
	return updateVehicleType(id, { isActive: 1 });
}

export async function deleteVehicleType(id: number) {
	const [deletedVehicleType] = await db
		.delete(vehicleTypes)
		.where(eq(vehicleTypes.id, id))
		.returning();
	return deletedVehicleType;
}

export async function existsVehicleTypeByName(name: string) {
	const vehicleType = await findVehicleTypeByName(name);
	return !!vehicleType;
}

export async function countActiveVehicleTypes() {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(vehicleTypes)
		.where(eq(vehicleTypes.isActive, 1));
	return result[0]?.count || 0;
}

export async function isVehicleTypeActive(id: number) {
	const vehicleType = await findVehicleTypeById(id);
	return vehicleType?.isActive === 1;
}

// Helpers
export function boolToNumber(value: boolean): number {
	return value ? 1 : 0;
}

export function numberToBool(value: number): boolean {
	return value === 1;
}
