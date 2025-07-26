export type CreatePaymentInput = {
	exitId: number;
	amount: number;
	method: "Cash" | "Card" | "Transfer";
	userId: string;
	notes?: string;
};

export type UpdatePaymentInput = {
	amount?: number;
	method?: "Cash" | "Card" | "Transfer";
	notes?: string;
};
