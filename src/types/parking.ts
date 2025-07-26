export type VehicleEntryInput = {
	plate: string;
	vehicleTypeId: number;
	userId: string;
};

export type VehicleExitInput = {
	plate: string;
	userId: string;
};

export type VehicleSearchResult = {
	found: boolean;
	data?: {
		plate: string;
		vehicleType: string;
		entryTime: Date;
		timeParked: string;
	};
};

export type EntryResult = {
	success: boolean;
	message: string;
	data?: {
		entryId: number;
		plate: string;
		entryTime: Date;
	};
};

export type ExitResult = {
	success: boolean;
	message: string;
	data?: {
		plate: string;
		exitTime: Date;
		timeParked: string;
		amount: number;
	};
};
