export interface VehicleType {
	id: number;
	name: string;
	isActive: boolean;
}

export interface Band {
	id: number;
	name: string;
	startHour: number;
	endHour: number;
	isActive: boolean;
}

export interface InitialRate {
	id: number;
	vehicleTypeId: number;
	amount: number;
	validFrom: Date;
	validTo: Date | null;
}

export interface ExtraRate {
	bandId: number;
	vehicleTypeId: number;
	amount: number;
	validFrom: Date;
	validTo: Date | null;
}

export interface ParkingEntry {
	id: number;
	plate: string;
	vehicleTypeId: number;
	entryTime: Date;
	initialRateId: number;
	userId: string;
	status: "Open" | "Closed" | "Paid";
}

export interface ParkingExit {
	id: number;
	entryId: number;
	userId: string;
	exitTime: Date;
	calculatedAmount: number;
	status: "Paid" | "NotPaid" | "Voided";
}

export interface Payment {
	id: number;
	exitId: number | null;
	amount: number;
	method: "Cash" | "Card" | "Transfer";
	userId: string;
	notes: string | null;
	createdAt: Date;
}
