"use server";

import { findAllInitialRates } from "@/lib/repositories/settings/initial-rate";
import { findAllVehicleTypes } from "@/lib/repositories/settings/vehicle-type";
import type { ResponseAction } from "@/lib/types/response-actions";
import type { GetInitialRatesResponse } from "@/lib/types/settings";
import { errorToString } from "@/lib/utils";

export async function getInitialRatesAction(): Promise<
	ResponseAction<GetInitialRatesResponse[]>
> {
	const initialRates = await findAllInitialRates();
	if (!initialRates.ok) {
		return {
			ok: false,
			error: errorToString(
				initialRates.error,
				"Error al obtener las tarifas iniciales",
			),
		};
	}

	const vehicleTypes = await findAllVehicleTypes();
	if (!vehicleTypes.ok) {
		return {
			ok: false,
			error: errorToString(
				vehicleTypes.error,
				"Error al obtener los tipos de vehículo",
			),
		};
	}

	const listInitialRates = initialRates.data?.map(
		(initialRate): GetInitialRatesResponse => ({
			id: initialRate.id,
			vehicleTypeId: initialRate.vehicleTypeId,
			amount: initialRate.amount,
			validFrom: initialRate.validFrom,
			validTo: initialRate.validTo,
			vehicleTypeName:
				vehicleTypes.data?.find((v) => v.id === initialRate.vehicleTypeId)
					?.name ?? "",
		}),
	);
	return { ok: true, data: listInitialRates ?? [] };
}
