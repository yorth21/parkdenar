import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function errorToString(
	err: unknown,
	fallback: string = "Ocurrió un error inesperado",
): string {
	if (typeof err === "string") return err;
	if (err instanceof Error) return err.message;
	try {
		return JSON.stringify(err);
	} catch {
		return fallback;
	}
}

export function formatCurrency(amount: number | string): string {
	const amountNumber = typeof amount === "string" ? Number(amount) : amount;

	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
	}).format(amountNumber / 100);
}
