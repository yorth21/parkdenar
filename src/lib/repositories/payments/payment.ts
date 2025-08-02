import { eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { paymentMethods, payments } from "@/db/schema";
import type { Payment } from "@/lib/types/parking-schema";

export const createPayment = async (payment: Omit<Payment, "id">) => {
	try {
		const [newPayment] = await db.insert(payments).values(payment).returning();
		return { ok: true, data: newPayment };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};

export const findPaymentsToCloseCash = async () => {
	try {
		const listPayments = await db
			.select({
				paymentMethodId: payments.paymentMethodId,
				amount: sql<number>`SUM(${payments.amount})`,
				paymentMethodName: paymentMethods.name,
			})
			.from(payments)
			.innerJoin(
				paymentMethods,
				eq(payments.paymentMethodId, paymentMethods.id),
			)
			.where(isNull(payments.cashClosureId))
			.groupBy(payments.paymentMethodId);

		return { ok: true, data: listPayments };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};

// Obtener pago por ID
export const findPaymentById = async (id: number) => {
	try {
		const [payment] = await db
			.select()
			.from(payments)
			.where(eq(payments.id, id))
			.limit(1);

		if (!payment) {
			return { ok: false, error: "No se encontró el pago" };
		}

		return { ok: true, data: payment };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};

// Obtener pago por ID de salida
export const findPaymentByExitId = async (exitId: number) => {
	try {
		const [payment] = await db
			.select()
			.from(payments)
			.where(eq(payments.exitId, exitId))
			.limit(1);

		if (!payment) {
			return { ok: false, error: "No se encontró el pago" };
		}

		return { ok: true, data: payment };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};
