import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { PAYMENT_METHODS } from "@/lib/constants/payment-methods";

interface PaymentExitDialogProps {
	modalOpen: boolean;
	setModalOpen: (open: boolean) => void;
	onConfirmPayment: (data: z.infer<typeof paymentExitSchema>) => void;
	onExitWithoutPayment: () => void;
	isLoading?: boolean;
}

const paymentExitSchema = z.object({
	paymentMethod: z.enum(
		PAYMENT_METHODS.map((pm) => pm.value) as [string, ...string[]],
	),
	amount: z.number().min(0),
	notes: z.string().optional(),
});

export function PaymentExitDialog({
	modalOpen,
	setModalOpen,
	onConfirmPayment,
	onExitWithoutPayment,
	isLoading = false,
}: PaymentExitDialogProps) {
	const form = useForm<z.infer<typeof paymentExitSchema>>({
		resolver: zodResolver(paymentExitSchema),
		defaultValues: {
			paymentMethod: "",
			amount: 0,
			notes: "",
		},
	});

	const onSubmit = (data: z.infer<typeof paymentExitSchema>) => {
		onConfirmPayment(data);
	};

	const handleExitWithoutPayment = () => {
		onExitWithoutPayment();
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

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-2"
					>
						{/* Fila 1: Método de pago y Valor a cobrar */}
						<div className="flex flex-col gap-2 sm:flex-row sm:gap-4 w-full">
							<div className="w-full sm:w-1/2">
								<FormField
									control={form.control}
									name="paymentMethod"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Método de pago</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Selecciona" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{PAYMENT_METHODS.map((pm) => (
														<SelectItem key={pm.value} value={pm.value}>
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
												<Input placeholder="Valor a cobrar" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Fila 2: Notas */}
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

						<Button className="mt-4" type="submit" disabled={isLoading}>
							{isLoading ? "Procesando..." : "Confirmar salida y cobro"}
						</Button>
					</form>
				</Form>

				<DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
					<Button
						variant="outline"
						onClick={handleExitWithoutPayment}
						disabled={isLoading}
						className="w-full sm:w-auto"
					>
						{isLoading ? "Procesando..." : "Cliente no paga"}
					</Button>
					<Button
						onClick={form.handleSubmit(onSubmit)}
						disabled={isLoading}
						className="w-full sm:w-auto"
					>
						{isLoading ? "Procesando..." : "Confirmar salida y cobro"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
