export type CreateInitialRateInput = {
	vehicleTypeId: number;
	amount: number;
	validFrom: Date;
	validTo?: Date;
};

export type UpdateInitialRateInput = {
	amount?: number;
	validTo?: Date;
};
