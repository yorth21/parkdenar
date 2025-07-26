import type { PaymentMethod } from "@/modules/payments/enums/payment";

export type CreatePaymentInput = {
	exitId: number;
	amount: number;
	method: PaymentMethod;
	userId: string;
	notes?: string;
};

export type UpdatePaymentInput = {
	amount?: number;
	method?: PaymentMethod;
	notes?: string;
};
