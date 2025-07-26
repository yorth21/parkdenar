export type CreateBandInput = {
	name: string;
	startHour: number;
	endHour: number;
	isActive?: number;
};

export type UpdateBandInput = {
	name?: string;
	startHour?: number;
	endHour?: number;
	isActive?: number;
};
