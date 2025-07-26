import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { payments, users } from "@/db/schema";
import type {
	CreatePaymentInput,
	UpdatePaymentInput,
} from "@/modules/payments/types/payment";

// Crear pago
export const createPayment = async (input: CreatePaymentInput) => {
	const [payment] = await db
		.insert(payments)
		.values({
			...input,
			createdAt: new Date(),
		})
		.returning();
	return payment;
};

// Obtener pago por ID
export const findPaymentById = async (id: number) => {
	const [row] = await db
		.select()
		.from(payments)
		.where(eq(payments.id, id))
		.limit(1);
	return row || null;
};

// Obtener pago por ID de salida
export const findPaymentByExitId = async (exitId: number) => {
	const [row] = await db
		.select({
			id: payments.id,
			exitId: payments.exitId,
			amount: payments.amount,
			method: payments.method,
			userId: payments.userId,
			notes: payments.notes,
			createdAt: payments.createdAt,
			userName: users.name,
		})
		.from(payments)
		.leftJoin(users, eq(payments.userId, users.id))
		.where(eq(payments.exitId, exitId))
		.limit(1);
	return row || null;
};

// Obtener todos los pagos con información detallada
export const findAllPayments = async () => {
	return db
		.select({
			id: payments.id,
			exitId: payments.exitId,
			amount: payments.amount,
			method: payments.method,
			userId: payments.userId,
			notes: payments.notes,
			createdAt: payments.createdAt,
			userName: users.name,
		})
		.from(payments)
		.leftJoin(users, eq(payments.userId, users.id))
		.orderBy(desc(payments.createdAt));
};

// Obtener pagos recientes
export const findRecentPayments = async (limit: number = 10) => {
	return db
		.select({
			id: payments.id,
			exitId: payments.exitId,
			amount: payments.amount,
			method: payments.method,
			userId: payments.userId,
			createdAt: payments.createdAt,
			userName: users.name,
		})
		.from(payments)
		.leftJoin(users, eq(payments.userId, users.id))
		.orderBy(desc(payments.createdAt))
		.limit(limit);
};

// Obtener pagos por usuario
export const findPaymentsByUser = async (userId: string) => {
	return db
		.select()
		.from(payments)
		.where(eq(payments.userId, userId))
		.orderBy(desc(payments.createdAt));
};

// Obtener pagos por método
export const findPaymentsByMethod = async (
	method: "Cash" | "Card" | "Transfer",
) => {
	return db
		.select({
			id: payments.id,
			exitId: payments.exitId,
			amount: payments.amount,
			method: payments.method,
			userId: payments.userId,
			createdAt: payments.createdAt,
			userName: users.name,
		})
		.from(payments)
		.leftJoin(users, eq(payments.userId, users.id))
		.where(eq(payments.method, method))
		.orderBy(desc(payments.createdAt));
};

// Obtener pagos por rango de fechas
export const findPaymentsByDateRange = async (
	startDate: Date,
	endDate: Date,
) => {
	const startTimestamp = startDate.getTime();
	const endTimestamp = endDate.getTime();

	return db
		.select({
			id: payments.id,
			exitId: payments.exitId,
			amount: payments.amount,
			method: payments.method,
			userId: payments.userId,
			createdAt: payments.createdAt,
			userName: users.name,
		})
		.from(payments)
		.leftJoin(users, eq(payments.userId, users.id))
		.where(
			and(
				sql`${payments.createdAt} >= ${startTimestamp}`,
				sql`${payments.createdAt} <= ${endTimestamp}`,
			),
		)
		.orderBy(desc(payments.createdAt));
};

// Actualizar pago
export const updatePayment = async (id: number, input: UpdatePaymentInput) => {
	const [updatedPayment] = await db
		.update(payments)
		.set(input)
		.where(eq(payments.id, id))
		.returning();
	return updatedPayment;
};

// Eliminar pago
export const deletePayment = async (id: number) => {
	const [deletedPayment] = await db
		.delete(payments)
		.where(eq(payments.id, id))
		.returning();
	return deletedPayment;
};

// Verificar si existe pago para una salida
export const hasPaymentForExit = async (exitId: number) => {
	const payment = await findPaymentByExitId(exitId);
	return !!payment;
};

// Contar total de pagos
export const countPayments = async () => {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(payments);
	return result[0]?.count || 0;
};

// Contar pagos por método
export const countPaymentsByMethod = async (
	method: "Cash" | "Card" | "Transfer",
) => {
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(payments)
		.where(eq(payments.method, method));
	return result[0]?.count || 0;
};

// Calcular total de pagos
export const calculateTotalPayments = async () => {
	const result = await db
		.select({ total: sql<number>`sum(${payments.amount})` })
		.from(payments);
	return result[0]?.total || 0;
};

// Calcular total por método de pago
export const calculateTotalByMethod = async (
	method: "Cash" | "Card" | "Transfer",
) => {
	const result = await db
		.select({ total: sql<number>`sum(${payments.amount})` })
		.from(payments)
		.where(eq(payments.method, method));
	return result[0]?.total || 0;
};

// Calcular total por rango de fechas
export const calculateTotalByDateRange = async (
	startDate: Date,
	endDate: Date,
) => {
	const startTimestamp = startDate.getTime();
	const endTimestamp = endDate.getTime();

	const result = await db
		.select({ total: sql<number>`sum(${payments.amount})` })
		.from(payments)
		.where(
			and(
				sql`${payments.createdAt} >= ${startTimestamp}`,
				sql`${payments.createdAt} <= ${endTimestamp}`,
			),
		);
	return result[0]?.total || 0;
};

// Obtener resumen de pagos por método
export const getPaymentSummaryByMethod = async () => {
	const result = await db
		.select({
			method: payments.method,
			count: sql<number>`count(*)`,
			total: sql<number>`sum(${payments.amount})`,
		})
		.from(payments)
		.groupBy(payments.method);
	return result;
};
