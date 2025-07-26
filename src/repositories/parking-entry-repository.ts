import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { parkingEntries, users, vehicleTypes } from "@/db/schema";

export type CreateParkingEntryInput = {
	plate: string;
	vehicleTypeId: number;
	initialRateId: number;
	userId: string;
	entryTime?: Date;
};

export type UpdateParkingEntryInput = {
	status?: "Open" | "Closed" | "Paid";
};

export class ParkingEntryRepository {
	// Crear entrada de parqueadero
	static async create(input: CreateParkingEntryInput) {
		const entryTime = input.entryTime || new Date();

		const [parkingEntry] = await db
			.insert(parkingEntries)
			.values({
				plate: input.plate.toUpperCase(),
				vehicleTypeId: input.vehicleTypeId,
				entryTime: entryTime.getTime(),
				initialRateId: input.initialRateId,
				userId: input.userId,
				status: "Open",
			})
			.returning();
		return parkingEntry;
	}

	// Obtener entrada por ID
	static async findById(id: number) {
		return db
			.select()
			.from(parkingEntries)
			.where(eq(parkingEntries.id, id))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener entrada activa por placa
	static async findActiveByPlate(plate: string) {
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
			.where(
				and(
					eq(parkingEntries.plate, plate.toUpperCase()),
					eq(parkingEntries.status, "Open"),
				),
			)
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener todas las entradas abiertas
	static async findAllOpen() {
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
	static async findRecent(limit: number = 10) {
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
	static async findByUser(userId: string) {
		return db
			.select()
			.from(parkingEntries)
			.where(eq(parkingEntries.userId, userId))
			.orderBy(desc(parkingEntries.entryTime));
	}

	// Actualizar entrada
	static async update(id: number, input: UpdateParkingEntryInput) {
		const [updatedEntry] = await db
			.update(parkingEntries)
			.set(input)
			.where(eq(parkingEntries.id, id))
			.returning();
		return updatedEntry;
	}

	// Cerrar entrada (marcar como cerrada)
	static async close(id: number) {
		return ParkingEntryRepository.update(id, { status: "Closed" });
	}

	// Marcar como pagada
	static async markAsPaid(id: number) {
		return ParkingEntryRepository.update(id, { status: "Paid" });
	}

	// Verificar si una placa tiene entrada activa
	static async hasActiveEntry(plate: string) {
		const entry = await ParkingEntryRepository.findActiveByPlate(plate);
		return !!entry;
	}

	// Contar entradas abiertas
	static async countOpen() {
		const result = await db
			.select({ count: sql<number>`count(*)` })
			.from(parkingEntries)
			.where(eq(parkingEntries.status, "Open"));
		return result[0]?.count || 0;
	}

	// Eliminar entrada (solo para casos especiales)
	static async delete(id: number) {
		const [deletedEntry] = await db
			.delete(parkingEntries)
			.where(eq(parkingEntries.id, id))
			.returning();
		return deletedEntry;
	}

	// Buscar entradas por placa (todas, no solo activas)
	static async findByPlate(plate: string) {
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
}
