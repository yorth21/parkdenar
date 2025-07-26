import type { ParkingEntryStatus } from "@/enums/parking";

export type CreateParkingEntryInput = {
	plate: string;
	vehicleTypeId: number;
	initialRateId: number;
	userId: string;
	entryTime?: Date;
};

export type UpdateParkingEntryInput = {
	status?: ParkingEntryStatus;
};
