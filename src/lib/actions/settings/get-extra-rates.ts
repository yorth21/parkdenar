"use server";

import { findAllActiveBands } from "@/lib/repositories/settings/band";
import { findAllExtraRates } from "@/lib/repositories/settings/extra-rate";
import { findAllActiveVehicleTypes } from "@/lib/repositories/settings/vehicle-type";
import type { ResponseAction } from "@/lib/types/response-actions";
import type { GetExtraRatesResponse } from "@/lib/types/settings";
import { errorToString } from "@/lib/utils";

export async function getExtraRatesAction(): Promise<
	ResponseAction<GetExtraRatesResponse[]>
> {
	const extraRates = await findAllExtraRates();
	if (!extraRates.ok) {
		return {
			ok: false,
			error: errorToString(
				extraRates.error,
				"Error al obtener las tarifas extra",
			),
		};
	}

	const bands = await findAllActiveBands();
	if (!bands.ok) {
		return {
			ok: false,
			error: errorToString(bands.error, "Error al obtener las bandas"),
		};
	}

	const vehicleTypes = await findAllActiveVehicleTypes();
	if (!vehicleTypes.ok) {
		return {
			ok: false,
			error: errorToString(
				vehicleTypes.error,
				"Error al obtener los tipos de vehículo",
			),
		};
	}

	const listExtraRates = extraRates.data?.map(
		(extraRate): GetExtraRatesResponse => ({
			bandId: extraRate.bandId,
			vehicleTypeId: extraRate.vehicleTypeId,
			amount: extraRate.amount,
			validFrom: extraRate.validFrom,
			validTo: extraRate.validTo,
			bandName: bands.data?.find((b) => b.id === extraRate.bandId)?.name ?? "",
			vehicleTypeName:
				vehicleTypes.data?.find((v) => v.id === extraRate.vehicleTypeId)
					?.name ?? "",
		}),
	);
	return { ok: true, data: listExtraRates ?? [] };
}
