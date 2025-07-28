"use client";

import { Car, Clock, Loader2, LogIn, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createExitAction } from "@/lib/actions/parking/create-exit";
import { createPaymentAction } from "@/lib/actions/payments/create-payment";
import type { CreateExitResponse } from "@/lib/types/parking";
import type { PaymentMethod } from "@/lib/types/parking-schema";
import type { CreatePaymentRequest } from "@/lib/types/payments";
import { useSearchVehicleStore } from "@/store/search-vehicle-store";
import { PaymentExitDialog } from "./payment-exit-dialog";

export function RegisterExitCard() {
	const searchedVehicle = useSearchVehicleStore(
		(state) => state.searchedVehicle,
	);
	const clearSearchVehicle = useSearchVehicleStore((state) => state.clear);
	const { data: session } = useSession();

	const [modalOpen, setModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [exitInfo, setExitInfo] = useState<CreateExitResponse | null>(null);

	const handleRegisterExit = async () => {
		setIsLoading(true);
		if (!session?.user?.id) {
			toast.error("Por favor, inicia sesión para registrar una salida");
			setIsLoading(false);
			return;
		}

		if (!searchedVehicle?.plate) {
			toast.error("Por favor, ingresa una placa para registrar la salida");
			setIsLoading(false);
			return;
		}

		const response = await createExitAction({
			plate: searchedVehicle.plate,
			userId: session.user.id,
		});

		if (!response.ok) {
			toast.error(response.error);
			return;
		}

		toast.success("Salida registrada correctamente");
		setExitInfo(response.data);
		setModalOpen(true);
		setIsLoading(false);
	};

	const onConfirmPayment = async (data: {
		paymentMethod: string;
		amountCents: number;
		notes?: string;
	}) => {
		setIsLoading(true);
		if (!session?.user?.id) {
			toast.error("Por favor, inicia sesión para registrar una salida");
			setIsLoading(false);
			return;
		}

		if (!exitInfo?.exit?.id) {
			toast.error("No se encontró registro de la salida");
			setIsLoading(false);
			return;
		}

		const payment: CreatePaymentRequest = {
			exitId: exitInfo?.exit?.id,
			amount: data.amountCents,
			method: data.paymentMethod as PaymentMethod,
			userId: session.user.id,
			notes: data.notes || null,
		};

		const response = await createPaymentAction(payment);
		if (!response.ok) {
			toast.error(response.error);
			setIsLoading(false);
			return;
		}

		toast.success("Pago registrado correctamente");
		setModalOpen(false);
		setIsLoading(false);
		clearSearchVehicle();
	};

	const onExitWithoutPayment = () => {
		toast.success("Salida registrada sin pago");
		setModalOpen(false);
		setIsLoading(false);
		clearSearchVehicle();
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Registrar Salida</CardTitle>
					<CardDescription>
						Confirma los datos del vehículo para registrar la salida.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Placa visual para vehículo encontrado */}
					<div className="flex justify-center">
						<div className="bg-yellow-400 border-4 border-black rounded-md px-6 py-2 inline-block shadow text-center">
							<span className="font-mono text-2xl font-bold tracking-widest text-black drop-shadow">
								{searchedVehicle?.plate}
							</span>
						</div>
					</div>

					<div className="text-center space-y-2">
						<p className="text-sm text-muted-foreground">
							Vehículo encontrado en el sistema
						</p>
						<p className="text-sm font-medium">
							Registrar como <span className="text-red-600">salida</span>
						</p>
					</div>

					{/* Información del vehículo */}
					<div className="grid grid-cols-1 gap-4 p-4 bg-muted/50 rounded-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Car className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm font-medium">Tipo:</span>
							</div>
							<span className="text-sm">
								{searchedVehicle?.vehicle?.vehicleType}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<LogIn className="h-4 w-4 text-green-600" />
								<span className="text-sm font-medium">Entrada:</span>
							</div>
							<span className="text-sm">
								{searchedVehicle?.vehicle?.entryTime.toLocaleString()}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Clock className="h-4 w-4 text-blue-600" />
								<span className="text-sm font-medium">
									Tiempo transcurrido:
								</span>
							</div>
							<span className="text-sm font-mono">
								{searchedVehicle?.vehicle?.timeParked}
							</span>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={clearSearchVehicle}>
						Cancelar
					</Button>
					<Button
						onClick={handleRegisterExit}
						disabled={isLoading}
						variant="destructive"
					>
						{isLoading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<LogOut className="mr-2 h-4 w-4" />
						)}
						Registrar Salida
					</Button>
				</CardFooter>
			</Card>

			<PaymentExitDialog
				modalOpen={modalOpen}
				onConfirmPayment={onConfirmPayment}
				onExitWithoutPayment={onExitWithoutPayment}
				isLoading={isLoading}
				defaultAmountCents={exitInfo?.exit?.calculatedAmount || 0}
				charges={exitInfo?.charges || []}
			/>
		</>
	);
}
