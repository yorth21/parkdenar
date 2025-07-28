"use server";

import { createPayment } from "@/lib/repositories/payments/payment";
import type {
	CreatePaymentRequest,
	CreatePaymentResponse,
} from "@/lib/types/payments";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export const createPaymentAction = async (
	payment: CreatePaymentRequest,
): Promise<ResponseAction<CreatePaymentResponse>> => {
	try {
		const newPayment = await createPayment({
			exitId: payment.exitId,
			amount: payment.amount,
			method: payment.method,
			userId: payment.userId,
			notes: payment.notes,
			createdAt: new Date(),
		});

		if (!newPayment.ok || !newPayment.data) {
			return {
				ok: false,
				error: errorToString(newPayment.error, "Error al crear el pago"),
			};
		}

		return { ok: true, data: { payment: newPayment.data } };
	} catch (error) {
		return { ok: false, error: errorToString(error, "Error al crear el pago") };
	}
};
