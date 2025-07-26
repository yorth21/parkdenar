export type CreateExtraRateInput = {
	bandId: number;
	vehicleTypeId: number;
	amount: number;
	validFrom: Date;
	validTo?: Date;
};
