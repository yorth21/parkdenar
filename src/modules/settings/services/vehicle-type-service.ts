import { findAllActiveVehicleTypes } from "../repositories/vehicle-type-repository";

export async function getVehicleTypes() {
	const vehicleTypes = await findAllActiveVehicleTypes();
	return vehicleTypes;
}
