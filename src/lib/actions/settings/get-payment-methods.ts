"use server";

import { findAllPaymentMethods } from "@/lib/repositories/settings/payment-methods-repo";
import type { PaymentMethod } from "@/lib/types/parking-schema";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function getPaymentMethodsAction(): Promise<
	ResponseAction<PaymentMethod[]>
> {
	try {
		const paymentMethods = await findAllPaymentMethods();
		if (!paymentMethods.ok) {
			return {
				ok: false,
				error: errorToString(
					paymentMethods.error,
					"Error al obtener los métodos de pago",
				),
			};
		}
		return {
			ok: true,
			data:
				paymentMethods.data?.map((method) => ({
					id: method.id,
					code: method.code,
					name: method.name,
					isActive: method.isActive === 1,
				})) ?? [],
		};
	} catch (error) {
		return {
			ok: false,
			error: errorToString(error, "Error al obtener los métodos de pago"),
		};
	}
}
