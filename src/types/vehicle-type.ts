export type CreateVehicleTypeInput = {
	name: string;
	isActive?: number;
};

export type UpdateVehicleTypeInput = {
	name?: string;
	isActive?: number;
};
