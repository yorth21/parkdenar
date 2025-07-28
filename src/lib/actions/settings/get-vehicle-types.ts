"use server";

import { findAllActiveVehicleTypes } from "@/lib/repositories/settings/vehicle-type";
import type { VehicleType } from "@/lib/types/parking-schema";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function getVehicleTypesAction(): Promise<
	ResponseAction<VehicleType[]>
> {
	const vehicleTypes = await findAllActiveVehicleTypes();
	if (!vehicleTypes.ok) {
		return {
			ok: false,
			error: errorToString(
				vehicleTypes.error,
				"Error al obtener los tipos de vehículos",
			),
		};
	}

	const listVehicleTypes = vehicleTypes.data?.map(
		(vehicleType): VehicleType => ({
			id: vehicleType.id,
			name: vehicleType.name,
			isActive: vehicleType.isActive === 1,
		}),
	);

	return { ok: true, data: listVehicleTypes ?? [] };
}
