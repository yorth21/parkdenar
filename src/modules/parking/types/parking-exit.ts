import type { ParkingExitStatus } from "@/modules/parking/enums/parking";

export type CreateParkingExitInput = {
	entryId: number;
	userId: string;
	exitTime: Date;
	calculatedAmount: number;
	status: ParkingExitStatus;
};

export type UpdateParkingExitInput = {
	calculatedAmount?: number;
	status?: ParkingExitStatus;
};
