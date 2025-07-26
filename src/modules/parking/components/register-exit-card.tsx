"use client";

import { Car, Clock, LogIn, LogOut } from "lucide-react";
import { useParkingStore } from "@/modules/parking/store/parking-store";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";

export function RegisterExitCard() {
	const { searchPlate, foundVehicle, registerExit, resetForm } =
		useParkingStore();

	if (!foundVehicle) return null;

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
							{searchPlate || "AAA-123"}
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
						<span className="text-sm">Carrp emcpmtradp</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<LogIn className="h-4 w-4 text-green-600" />
							<span className="text-sm font-medium">Entrada:</span>
						</div>
						<span className="text-sm">carro fecha</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<Clock className="h-4 w-4 text-blue-600" />
							<span className="text-sm font-medium">Tiempo transcurrido:</span>
						</div>
						<span className="text-sm font-mono">
							{(() => {
								const entryTime = new Date(foundVehicle.entryTime);
								const now = new Date();
								const diffMs = now.getTime() - entryTime.getTime();
								const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
								const diffMinutes = Math.floor(
									(diffMs % (1000 * 60 * 60)) / (1000 * 60),
								);
								return `${diffHours}h ${diffMinutes}m`;
							})()}
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline" onClick={resetForm}>
					Cancelar
				</Button>
				<Button onClick={registerExit} variant="destructive">
					<LogOut className="mr-2 h-4 w-4" />
					Registrar Salida
				</Button>
			</CardFooter>
		</Card>
	);
}
