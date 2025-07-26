export type CreateParkingExitInput = {
	entryId: number;
	userId: string;
	exitTime?: Date;
	calculatedAmount: number;
	status?: "Paid" | "Voided";
};

export type UpdateParkingExitInput = {
	calculatedAmount?: number;
	status?: "Paid" | "Voided";
};
