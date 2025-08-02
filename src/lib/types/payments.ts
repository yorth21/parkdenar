import type { Payment } from "@/lib/types/parking-schema";

export interface CreatePaymentRequest {
	exitId: number;
	amount: number;
	paymentMethodId: number;
	userId: string;
	notes: string | null;
}

export interface CreatePaymentResponse {
	payment: Payment;
}
