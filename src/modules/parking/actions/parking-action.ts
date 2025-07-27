"use server";

import {
	registerExit,
	searchVehicle,
} from "@/modules/parking/services/parking-service";
import type { VehicleExitInput } from "@/modules/parking/types/parking";

export async function searchVehicleAction(plate: string) {
	return searchVehicle(plate);
}

export async function createParkingExitAction(input: VehicleExitInput) {
	return registerExit(input);
}
