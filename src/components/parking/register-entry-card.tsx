"use client";

import { Bike, Car, Clock, LogIn, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useParkingStore } from "@/stores/parking-store";

export function RegisterEntryCard() {
	const { searchPlate, vehicleType, setVehicleType, registerEntry, resetForm } =
		useParkingStore();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Registrar Nueva Entrada</CardTitle>
				<CardDescription>
					Selecciona el tipo de vehículo para registrar la entrada.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Placa visual */}
				<div className="flex justify-center">
					<div className="bg-yellow-400 border-4 border-black rounded-md px-6 py-2 inline-block shadow text-center">
						<span className="font-mono text-2xl font-bold tracking-widest text-black drop-shadow">
							{searchPlate || "AAA-123"}
						</span>
					</div>
				</div>

				{/* Mensaje contextual */}
				<div className="text-center space-y-2">
					<p className="text-sm text-muted-foreground">
						Este vehículo no está registrado en el sistema
					</p>
					<p className="text-sm font-medium">
						Registrar como <span className="text-green-600">nueva entrada</span>
					</p>
				</div>

				{/* Información de registro */}
				<div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
					<Clock className="h-4 w-4" />
					<span>Fecha y hora: {new Date().toLocaleString()}</span>
				</div>

				{/* Selector de tipo de vehículo */}
				<div className="space-y-3">
					<Label htmlFor="vehicle-type" className="text-base font-medium">
						Tipo de Vehículo
					</Label>
					<Select value={vehicleType} onValueChange={setVehicleType}>
						<SelectTrigger id="vehicle-type" className="w-full h-12">
							<SelectValue placeholder="Selecciona un tipo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="car">
								<div className="flex items-center py-1">
									<Car className="mr-3 h-5 w-5 text-blue-600" />
									<span className="text-base">Carro</span>
								</div>
							</SelectItem>
							<SelectItem value="motorcycle">
								<div className="flex items-center py-1">
									<Zap className="mr-3 h-5 w-5 text-orange-600" />
									<span className="text-base">Moto</span>
								</div>
							</SelectItem>
							<SelectItem value="bicycle">
								<div className="flex items-center py-1">
									<Bike className="mr-3 h-5 w-5 text-green-600" />
									<span className="text-base">Bicicleta</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between pt-6">
				<Button variant="outline" onClick={resetForm}>
					Cancelar
				</Button>
				<Button
					onClick={registerEntry}
					disabled={!vehicleType}
					className="min-w-[140px]"
				>
					<LogIn className="mr-2 h-4 w-4" />
					Registrar Entrada
				</Button>
			</CardFooter>
		</Card>
	);
}
