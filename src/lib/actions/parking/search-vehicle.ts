"use server";

import { findActiveParkingEntryByPlate } from "@/lib/repositories/parking/parking-entry";
import { findVehicleTypeById } from "@/lib/repositories/settings/vehicle-type";
import type {
	SearchVehicleRequest,
	SearchVehicleResponse,
} from "@/lib/types/parking";
import type { ParkingEntry } from "@/lib/types/parking-schema";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function searchVehicleAction(
	request: SearchVehicleRequest,
): Promise<ResponseAction<SearchVehicleResponse>> {
	try {
		const parkingEntry = await findActiveParkingEntryByPlate(request.plate);
		if (!parkingEntry.ok) {
			return {
				ok: true,
				data: { found: false, plate: request.plate, vehicle: null },
			};
		}

		const vehicle = parkingEntry.data as ParkingEntry;

		const vehicleType = await findVehicleTypeById(vehicle.vehicleTypeId);
		if (!vehicleType.ok || !vehicleType.data) {
			return {
				ok: false,
				error: errorToString(
					vehicleType.error,
					"Error al buscar el tipo de vehículo",
				),
			};
		}

		return {
			ok: true,
			data: {
				found: true,
				plate: vehicle.plate,
				vehicle: {
					vehicleType: vehicleType.data.name,
					entryTime: vehicle.entryTime,
					timeParked: calculateTimeParked(vehicle.entryTime, new Date()),
				},
			},
		};
	} catch (err: unknown) {
		return {
			ok: false,
			error: errorToString(err, "Error al buscar el vehículo"),
		};
	}
}

function calculateTimeParked(entryTime: Date, exitTime: Date): string {
	const diffMs = exitTime.getTime() - entryTime.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	return `${diffHours}h ${diffMinutes}m`;
}
