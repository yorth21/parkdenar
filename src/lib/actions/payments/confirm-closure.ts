"use server";

import { isNull } from "drizzle-orm";
import { db } from "@/db";
import { cashClosures, cashClosureTotals, payments } from "@/db/schema";
import { findLastEntryCashClosure } from "@/lib/repositories/payments/cash-closures-repo";
import { findPaymentsToCloseCash } from "@/lib/repositories/payments/payment";
import type { ConfirmClosureRequest } from "@/lib/types/payments";
import { errorToString } from "@/lib/utils";

export const confirmClosureAction = async (request: ConfirmClosureRequest) => {
	const { cashCounted, notes, userId } = request;

	const lastEntry = await findLastEntryCashClosure();
	if (!lastEntry.ok || !lastEntry.data) {
		return {
			ok: false,
			error: errorToString(
				lastEntry.error,
				"Error al obtener el último cierre de caja",
			),
		};
	}

	const paymentsToCloseCash = await findPaymentsToCloseCash();
	if (!paymentsToCloseCash.ok || !paymentsToCloseCash.data) {
		return {
			ok: false,
			error: errorToString(
				paymentsToCloseCash.error,
				"Error al obtener los pagos a cerrar",
			),
		};
	}

	try {
		const difference =
			cashCounted -
			paymentsToCloseCash.data.reduce(
				(acc, payment) => acc + payment.amount,
				0,
			);

		await db.transaction(async (tx) => {
			const [cashClosure] = await tx
				.insert(cashClosures)
				.values({
					startTime: lastEntry.data.endTime,
					endTime: new Date(),
					userId,
					cashCounted: cashCounted,
					discrepancy: difference,
					notes,
				})
				.returning({ id: cashClosures.id });

			const totals = paymentsToCloseCash.data.map((payment) => {
				return {
					paymentMethodId: payment.paymentMethodId,
					amount: payment.amount,
					closureId: cashClosure.id,
				};
			});

			await tx.insert(cashClosureTotals).values(totals);

			await tx
				.update(payments)
				.set({ cashClosureId: cashClosure.id })
				.where(isNull(payments.cashClosureId));
		});

		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: errorToString(error, "Error al confirmar el cierre de caja"),
		};
	}
};
