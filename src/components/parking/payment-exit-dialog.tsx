import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getPaymentMethodsAction } from "@/lib/actions/settings/get-payment-methods";
import type { ParkingChargeDetail } from "@/lib/types/parking";
import type { PaymentMethod } from "@/lib/types/parking-schema";
import { formatCurrency } from "@/lib/utils";

interface PaymentExitDialogProps {
	modalOpen: boolean;
	onConfirmPayment: (data: {
		paymentMethodId: number;
		amountCents: number;
		notes?: string;
	}) => void;
	onExitWithoutPayment: () => void;
	isLoading?: boolean;
	defaultAmountCents: number;
	charges: ParkingChargeDetail[];
}

const paymentExitSchema = z.object({
	paymentMethodId: z.string({ error: "Debes seleccionar un método de pago" }),
	amount: z.coerce
		.number({ error: "El valor a cobrar es obligatorio" })
		.min(0, { error: "El valor no puede ser negativo" }),
	notes: z.string().optional(),
});

type PaymentExitValues = z.infer<typeof paymentExitSchema>;

export function PaymentExitDialog({
	modalOpen,
	onConfirmPayment,
	onExitWithoutPayment,
	isLoading = false,
	defaultAmountCents = 0,
	charges = [],
}: PaymentExitDialogProps) {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

	const form = useForm({
		resolver: zodResolver(paymentExitSchema),
		defaultValues: {
			amount: defaultAmountCents / 100,
			notes: "",
		},
	});

	useEffect(() => {
		const getPaymentMethods = async () => {
			const paymentMethods = await getPaymentMethodsAction();
			if (paymentMethods.ok) {
				setPaymentMethods(paymentMethods.data);
			}
		};

		getPaymentMethods();
	}, []);

	useEffect(() => {
		if (modalOpen) {
			form.reset({
				paymentMethodId: Number(paymentMethods[0].id).toString(),
				amount: defaultAmountCents / 100,
				notes: "",
			});
		}
	}, [modalOpen, defaultAmountCents, form, paymentMethods]);

	const onSubmit = (data: PaymentExitValues) => {
		onConfirmPayment({
			paymentMethodId: Number(data.paymentMethodId),
			amountCents: data.amount * 100,
			notes: data.notes,
		});
	};

	return (
		<Dialog open={modalOpen} onOpenChange={() => {}}>
			<DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Confirmar cobro de salida</DialogTitle>
					<DialogDescription>
						Completa la información del cobro y método de pago.
					</DialogDescription>
				</DialogHeader>

				{charges.length > 0 && (
					<Accordion type="single" collapsible>
						<AccordionItem value="charge-details">
							<AccordionTrigger>Ver desglose de cargos</AccordionTrigger>
							<AccordionContent>
								<ul className="space-y-1">
									{charges.map((c, i) => (
										<li
											key={`${c.chargeName}-${i}`}
											className="flex justify-between"
										>
											<span>{c.chargeName}</span>
											<span>{formatCurrency(c.amount)}</span>
										</li>
									))}
									<li className="flex justify-between font-semibold mt-2 text-lg">
										<span>Total a cobrar</span>
										<span>
											{formatCurrency(
												charges.reduce((acc, c) => acc + c.amount, 0),
											)}
										</span>
									</li>
								</ul>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				)}

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col gap-2">
							<div className="flex flex-col gap-2 sm:flex-row sm:gap-4 w-full">
								<div className="w-full sm:w-1/2">
									<FormField
										control={form.control}
										name="paymentMethodId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Método de pago</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value.toString()}
												>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Selecciona" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{paymentMethods.map((pm) => (
															<SelectItem key={pm.id} value={pm.id.toString()}>
																{pm.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="w-full sm:w-1/2">
									<FormField
										control={form.control}
										name="amount"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Valor a cobrar</FormLabel>
												<FormControl>
													<Input
														type="text"
														inputMode="decimal"
														min={0}
														placeholder="Valor a cobrar"
														{...field}
														value={
															field.value === undefined || field.value === null
																? ""
																: Number(field.value).toLocaleString("es-CO", {
																		style: "currency",
																		currency: "COP",
																		minimumFractionDigits: 0,
																		maximumFractionDigits: 0,
																	})
														}
														onChange={(e) => {
															const raw = e.target.value.replace(/[^\d]/g, "");
															field.onChange(raw ? Number(raw) : "");
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="w-full">
								<FormField
									control={form.control}
									name="notes"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Notas (opcional)</FormLabel>
											<FormControl>
												<Input placeholder="Notas" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-4 mt-2">
							<Button
								variant="outline"
								type="button"
								onClick={onExitWithoutPayment}
								disabled={isLoading}
								className="w-full sm:w-auto"
							>
								Omitir pago
							</Button>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full sm:w-auto"
							>
								{isLoading ? "Procesando..." : "Confirmar salida y cobro"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
