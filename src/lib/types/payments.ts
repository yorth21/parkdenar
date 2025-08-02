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

export interface GenerateClosurePreviewResponse {
	startTime: Date;
	endTime: Date;
	amount: number;
	totals: {
		paymentMethodId: number;
		paymentMethodName: string;
		amount: number;
	}[];
}

export interface ConfirmClosureRequest {
	userId: string;
	cashCounted: number;
	notes: string | null;
}
