import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments } from "@/db/schema";
import type { Payment } from "@/lib/types/parking-schema";

export const createPayment = async (payment: Omit<Payment, "id">) => {
	try {
		const [newPayment] = await db.insert(payments).values(payment).returning();
		return { ok: true, data: newPayment };
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
		return { ok: true, data: payment || null };
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
		return { ok: true, data: payment || null };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
};
