import { eq } from "drizzle-orm";
import { db } from "@/db";
import { payments } from "@/db/schema";

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
		.select()
		.from(payments)
		.where(eq(payments.exitId, exitId))
		.limit(1);
	return row || null;
};
