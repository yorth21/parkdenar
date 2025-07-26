export type CreateParkingEntryInput = {
	plate: string;
	vehicleTypeId: number;
	initialRateId: number;
	userId: string;
	entryTime?: Date;
};

export type UpdateParkingEntryInput = {
	status?: "Open" | "Closed" | "Paid";
};
