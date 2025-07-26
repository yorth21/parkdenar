import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { parkingEntries, parkingExit, users } from "@/db/schema";
import type {
	CreateParkingExitInput,
	UpdateParkingExitInput,
} from "@/types/parking-exit";

// Crear registro de salida
export const createParkingExit = async (input: CreateParkingExitInput) => {
	const [exit] = await db
		.insert(parkingExit)
		.values({
			...input,
			exitTime: input.exitTime || new Date(),
		})
		.returning();
	return exit;
};

// Obtener salida por ID
export const findParkingExitById = async (id: number) => {
	const [row] = await db
		.select()
		.from(parkingExit)
		.where(eq(parkingExit.id, id))
		.limit(1);
	return row || null;
};

// Obtener salida por ID de entrada
export const findParkingExitByEntryId = async (entryId: number) => {
	const [row] = await db
		.select({
			id: parkingExit.id,
			entryId: parkingExit.entryId,
			userId: parkingExit.userId,
			exitTime: parkingExit.exitTime,
			calculatedAmount: parkingExit.calculatedAmount,
			status: parkingExit.status,
			userName: users.name,
		})
		.from(parkingExit)
		.leftJoin(users, eq(parkingExit.userId, users.id))
		.where(eq(parkingExit.entryId, entryId))
		.limit(1);
	return row || null;
};

// Obtener todas las salidas con información detallada
export const findAllParkingExits = async () => {
	return db
		.select({
			id: parkingExit.id,
			entryId: parkingExit.entryId,
			userId: parkingExit.userId,
			exitTime: parkingExit.exitTime,
			calculatedAmount: parkingExit.calculatedAmount,
			status: parkingExit.status,
			userName: users.name,
			entryPlate: parkingEntries.plate,
			entryTime: parkingEntries.entryTime,
		})
		.from(parkingExit)
		.leftJoin(users, eq(parkingExit.userId, users.id))
		.leftJoin(parkingEntries, eq(parkingExit.entryId, parkingEntries.id))
		.orderBy(desc(parkingExit.exitTime));
};

// Obtener salidas recientes
export const findRecentParkingExits = async (limit: number = 10) => {
	return db
		.select({
			id: parkingExit.id,
			entryId: parkingExit.entryId,
			exitTime: parkingExit.exitTime,
			calculatedAmount: parkingExit.calculatedAmount,
			status: parkingExit.status,
			userName: users.name,
			entryPlate: parkingEntries.plate,
		})
		.from(parkingExit)
		.leftJoin(users, eq(parkingExit.userId, users.id))
		.leftJoin(parkingEntries, eq(parkingExit.entryId, parkingEntries.id))
		.orderBy(desc(parkingExit.exitTime))
		.limit(limit);
};

// Obtener salidas por usuario
export const findParkingExitsByUser = async (userId: string) => {
	return db
		.select()
		.from(parkingExit)
		.where(eq(parkingExit.userId, userId))
		.orderBy(desc(parkingExit.exitTime));
};

// Obtener salidas pagadas
export const findPaidParkingExits = async () => {
	return db
		.select()
		.from(parkingExit)
		.where(eq(parkingExit.status, "Paid"))
		.orderBy(desc(parkingExit.exitTime));
};

// Obtener salidas anuladas
export const findVoidedParkingExits = async () => {
	return db
		.select()
		.from(parkingExit)
		.where(eq(parkingExit.status, "Voided"))
		.orderBy(desc(parkingExit.exitTime));
};

// Actualizar salida
export const updateParkingExit = async (
	id: number,
	input: UpdateParkingExitInput,
) => {
	const [updatedExit] = await db
		.update(parkingExit)
		.set(input)
		.where(eq(parkingExit.id, id))
		.returning();
	return updatedExit;
};

// Anular salida
export const voidParkingExit = async (id: number) => {
	return updateParkingExit(id, { status: "Voided" });
};

// Marcar como pagada
export const markParkingExitAsPaid = async (id: number) => {
	return updateParkingExit(id, { status: "Paid" });
};

// Eliminar salida (solo casos especiales)
export const deleteParkingExit = async (id: number) => {
	const [deletedExit] = await db
		.delete(parkingExit)
		.where(eq(parkingExit.id, id))
		.returning();
	return deletedExit;
};

// Verificar si una entrada ya tiene salida
export const hasExitForEntry = async (entryId: number) => {
	const exit = await findParkingExitByEntryId(entryId);
	return !!exit;
};

// Contar total de salidas
export const countParkingExits = async () => {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(parkingExit);
	return result[0]?.count || 0;
};

// Contar salidas pagadas
export const countPaidParkingExits = async () => {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(parkingExit)
		.where(eq(parkingExit.status, "Paid"));
	return result[0]?.count || 0;
};

// Calcular total recaudado
export const calculateTotalRevenue = async () => {
	const result = await db
		.select({ total: sql<number>`sum(${parkingExit.calculatedAmount})` })
		.from(parkingExit)
		.where(eq(parkingExit.status, "Paid"));
	return result[0]?.total || 0;
};

// Calcular ingresos por fecha
export const calculateRevenueByDateRange = async (
	startDate: Date,
	endDate: Date,
) => {
	const startTimestamp = startDate.getTime();
	const endTimestamp = endDate.getTime();

	const result = await db
		.select({ total: sql<number>`sum(${parkingExit.calculatedAmount})` })
		.from(parkingExit)
		.where(
			and(
				eq(parkingExit.status, "Paid"),
				sql`${parkingExit.exitTime} >= ${startTimestamp}`,
				sql`${parkingExit.exitTime} <= ${endTimestamp}`,
			),
		);
	return result[0]?.total || 0;
};
