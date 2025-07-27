"use client";

import { Car, Clock, LogIn, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useVehicleSearchStore } from "@/modules/parking/stores/vehicle-search-store";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { createParkingExitAction } from "../actions/parking-action";

export function RegisterExitCard() {
	const { vehicleSearchResult, reset } = useVehicleSearchStore();
	const { data: session } = useSession();

	const handleRegisterExit = async () => {
		console.log("Exit");
		const result = await createParkingExitAction({
			plate: vehicleSearchResult?.data?.plate || "",
			userId: session?.user?.id || "",
		});

		if (result.success) {
			reset();
			toast.success("Salida registrada correctamente");
		}
	};

	return (
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
							{vehicleSearchResult?.data?.plate}
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
							{vehicleSearchResult?.data?.vehicleType}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<LogIn className="h-4 w-4 text-green-600" />
							<span className="text-sm font-medium">Entrada:</span>
						</div>
						<span className="text-sm">
							{vehicleSearchResult?.data?.entryTime.toLocaleString()}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Clock className="h-4 w-4 text-blue-600" />
							<span className="text-sm font-medium">Tiempo transcurrido:</span>
						</div>
						<span className="text-sm font-mono">
							{vehicleSearchResult?.data?.timeParked}
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline" onClick={reset}>
					Cancelar
				</Button>
				<Button onClick={handleRegisterExit} variant="destructive">
					<LogOut className="mr-2 h-4 w-4" />
					Registrar Salida
				</Button>
			</CardFooter>
		</Card>
	);
}
