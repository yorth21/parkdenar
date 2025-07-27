"use server";

import { searchVehicle } from "@/modules/parking/services/parking-service";

export async function searchVehicleAction(plate: string) {
	return searchVehicle(plate);
}
