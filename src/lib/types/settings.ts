import type { ExtraRate, InitialRate } from "@/lib/types/parking-schema";

export interface GetExtraRatesResponse extends ExtraRate {
	bandName: string;
	vehicleTypeName: string;
}

export interface GetInitialRatesResponse extends InitialRate {
	vehicleTypeName: string;
}
