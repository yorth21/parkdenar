"use server";

import { findLastEntryCashClosure } from "@/lib/repositories/payments/cash-closures-repo";
import { findPaymentsToCloseCash } from "@/lib/repositories/payments/payment";
import type { GenerateClosurePreviewResponse } from "@/lib/types/payments";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export const generateClosurePreviewAction = async (): Promise<
	ResponseAction<GenerateClosurePreviewResponse>
> => {
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

	const amount = paymentsToCloseCash.data.reduce(
		(acc, payment) => acc + payment.amount,
		0,
	);

	const preview: GenerateClosurePreviewResponse = {
		startTime: lastEntry.data.endTime,
		endTime: new Date(),
		amount: amount,
		totals: paymentsToCloseCash.data.map((payment) => ({
			paymentMethodId: payment.paymentMethodId,
			paymentMethodName: payment.paymentMethodName,
			amount: payment.amount,
		})),
	};

	return { ok: true, data: preview };
};
