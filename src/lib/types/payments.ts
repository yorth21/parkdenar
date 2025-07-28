import type { Payment, PaymentMethod } from "@/lib/types/parking-schema";

export interface CreatePaymentRequest {
	exitId: number;
	amount: number;
	method: PaymentMethod;
	userId: string;
	notes: string | null;
}

export interface CreatePaymentResponse {
	payment: Payment;
}
