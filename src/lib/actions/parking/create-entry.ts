"use server";

import {
	createParkingEntry,
	hasActiveParkingEntry,
} from "@/lib/repositories/parking/parking-entry";
import { findCurrentInitialRateByVehicleType } from "@/lib/repositories/settings/initial-rate";
import type {
	CreateEntryRequest,
	CreateEntryResponse,
} from "@/lib/types/parking";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function createEntryAction(
	request: CreateEntryRequest,
): Promise<ResponseAction<CreateEntryResponse>> {
	try {
		// Verificar que la placa no esté ya registrada
		const hasActive = await hasActiveParkingEntry(request.plate);
		if (hasActive) {
			return {
				ok: false,
				error: "Este vehículo ya tiene una entrada activa en el parqueadero",
			};
		}

		const initialRate = await findCurrentInitialRateByVehicleType(
			request.vehicleTypeId,
		);
		if (!initialRate.ok || !initialRate.data) {
			return {
				ok: false,
				error: errorToString(
					initialRate.error,
					"Error al buscar la tarifa inicial",
				),
			};
		}

		const entry = await createParkingEntry({
			plate: request.plate.toUpperCase(),
			vehicleTypeId: request.vehicleTypeId,
			initialRateId: initialRate.data.id,
			userId: request.userId,
			entryTime: new Date(),
			status: "Open",
		});

		if (!entry.ok || !entry.data) {
			return {
				ok: false,
				error: errorToString(entry.error, "Error al crear la entrada"),
			};
		}

		return {
			ok: true,
			data: { entry: entry.data },
		};
	} catch (err: unknown) {
		return {
			ok: false,
			error: errorToString(err, "Error al crear la entrada"),
		};
	}
}
