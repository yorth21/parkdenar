import { eq } from "drizzle-orm";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";

export async function findAllPaymentMethods() {
	try {
		const listPaymentMethods = await db.select().from(paymentMethods);
		return { ok: true, data: listPaymentMethods };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}

export async function findAllActivePaymentMethods() {
	try {
		const listPaymentMethods = await db
			.select()
			.from(paymentMethods)
			.where(eq(paymentMethods.isActive, 1));
		return { ok: true, data: listPaymentMethods };
	} catch (err: unknown) {
		return { ok: false, error: err };
	}
}
