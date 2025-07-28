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

export type ParkingEntryStatus = "Open" | "Closed" | "Paid";
export interface ParkingEntry {
	id: number;
	plate: string;
	vehicleTypeId: number;
	entryTime: Date;
	initialRateId: number;
	userId: string;
	status: ParkingEntryStatus;
}

export type ParkingExitStatus = "Paid" | "NotPaid" | "Voided";
export interface ParkingExit {
	id: number;
	entryId: number;
	userId: string;
	exitTime: Date;
	calculatedAmount: number;
	status: ParkingExitStatus;
}

export type PaymentMethod = "Cash" | "Card" | "Transfer";
export interface Payment {
	id: number;
	exitId: number | null;
	amount: number;
	method: PaymentMethod;
	userId: string;
	notes: string | null;
	createdAt: Date;
}
