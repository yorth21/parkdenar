import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { parkingEntries, users, vehicleTypes } from "@/db/schema";
import { ParkingEntryStatus } from "@/enums/parking";
import type {
	CreateParkingEntryInput,
	UpdateParkingEntryInput,
} from "@/types/parking-entry";

// Crear entrada de parqueadero
export async function createParkingEntry(input: CreateParkingEntryInput) {
	const [parkingEntry] = await db
		.insert(parkingEntries)
		.values({
			...input,
			plate: input.plate.toUpperCase(),
			entryTime: input.entryTime || new Date(),
		})
		.returning();
	return parkingEntry;
}

// Obtener entrada por ID
export async function findParkingEntryById(id: number) {
	const [entry] = await db
		.select()
		.from(parkingEntries)
		.where(eq(parkingEntries.id, id))
		.limit(1);
	return entry || null;
}

// Obtener entrada activa por placa
export async function findActiveParkingEntryByPlate(plate: string) {
	const [entry] = await db
		.select({
			id: parkingEntries.id,
			plate: parkingEntries.plate,
			vehicleTypeId: parkingEntries.vehicleTypeId,
			entryTime: parkingEntries.entryTime,
			initialRateId: parkingEntries.initialRateId,
			userId: parkingEntries.userId,
			status: parkingEntries.status,
			vehicleTypeName: vehicleTypes.name,
			userName: users.name,
		})
		.from(parkingEntries)
		.leftJoin(vehicleTypes, eq(parkingEntries.vehicleTypeId, vehicleTypes.id))
		.leftJoin(users, eq(parkingEntries.userId, users.id))
		.where(
			and(
				eq(parkingEntries.plate, plate.toUpperCase()),
				eq(parkingEntries.status, "Open"),
			),
		)
		.limit(1);
	return entry || null;
}

// Obtener todas las entradas abiertas
export async function findAllOpenParkingEntries() {
	return db
		.select({
			id: parkingEntries.id,
			plate: parkingEntries.plate,
			vehicleTypeId: parkingEntries.vehicleTypeId,
			entryTime: parkingEntries.entryTime,
			initialRateId: parkingEntries.initialRateId,
			userId: parkingEntries.userId,
			status: parkingEntries.status,
			vehicleTypeName: vehicleTypes.name,
			userName: users.name,
		})
		.from(parkingEntries)
		.leftJoin(vehicleTypes, eq(parkingEntries.vehicleTypeId, vehicleTypes.id))
		.leftJoin(users, eq(parkingEntries.userId, users.id))
		.where(eq(parkingEntries.status, "Open"))
		.orderBy(desc(parkingEntries.entryTime));
}

// Obtener entradas recientes
export async function findRecentParkingEntries(limit: number = 10) {
	return db
		.select({
			id: parkingEntries.id,
			plate: parkingEntries.plate,
			vehicleTypeId: parkingEntries.vehicleTypeId,
			entryTime: parkingEntries.entryTime,
			status: parkingEntries.status,
			vehicleTypeName: vehicleTypes.name,
			userName: users.name,
		})
		.from(parkingEntries)
		.leftJoin(vehicleTypes, eq(parkingEntries.vehicleTypeId, vehicleTypes.id))
		.leftJoin(users, eq(parkingEntries.userId, users.id))
		.orderBy(desc(parkingEntries.entryTime))
		.limit(limit);
}

// Obtener entradas por usuario
export async function findParkingEntriesByUser(userId: string) {
	return db
		.select()
		.from(parkingEntries)
		.where(eq(parkingEntries.userId, userId))
		.orderBy(desc(parkingEntries.entryTime));
}

// Actualizar entrada
export async function updateParkingEntry(
	id: number,
	input: UpdateParkingEntryInput,
) {
	const [updatedEntry] = await db
		.update(parkingEntries)
		.set(input)
		.where(eq(parkingEntries.id, id))
		.returning();
	return updatedEntry;
}

// Cerrar entrada (marcar como cerrada)
export async function closeParkingEntry(id: number) {
	return updateParkingEntry(id, { status: ParkingEntryStatus.Closed });
}

// Marcar como pagada
export async function markParkingEntryAsPaid(id: number) {
	return updateParkingEntry(id, { status: ParkingEntryStatus.Paid });
}

// Verificar si una placa tiene entrada activa
export async function hasActiveParkingEntry(plate: string) {
	const entry = await findActiveParkingEntryByPlate(plate);
	return !!entry;
}

// Contar entradas abiertas
export async function countOpenParkingEntries() {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(parkingEntries)
		.where(eq(parkingEntries.status, "Open"));
	return result[0]?.count || 0;
}

// Eliminar entrada (solo para casos especiales)
export async function deleteParkingEntry(id: number) {
	const [deletedEntry] = await db
		.delete(parkingEntries)
		.where(eq(parkingEntries.id, id))
		.returning();
	return deletedEntry;
}

// Buscar entradas por placa (todas, no solo activas)
export async function findParkingEntriesByPlate(plate: string) {
	return db
		.select({
			id: parkingEntries.id,
			plate: parkingEntries.plate,
			vehicleTypeId: parkingEntries.vehicleTypeId,
			entryTime: parkingEntries.entryTime,
			status: parkingEntries.status,
			vehicleTypeName: vehicleTypes.name,
			userName: users.name,
		})
		.from(parkingEntries)
		.leftJoin(vehicleTypes, eq(parkingEntries.vehicleTypeId, vehicleTypes.id))
		.leftJoin(users, eq(parkingEntries.userId, users.id))
		.where(eq(parkingEntries.plate, plate.toUpperCase()))
		.orderBy(desc(parkingEntries.entryTime));
}
