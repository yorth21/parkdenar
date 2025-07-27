"use server";

import { getVehicleTypes } from "../services/vehicle-type-service";

export async function getVehicleTypesAction() {
	return getVehicleTypes();
}
