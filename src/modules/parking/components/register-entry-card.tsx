"use client";

import { Bike, Car, Clock, LogIn, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getVehicleTypesAction } from "@/modules/settings/actions/vehicle-type-action";
import type { CreateVehicleTypeInput } from "@/modules/settings/types/vehicle-type";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";

export function RegisterEntryCard() {
	const [vehicleTypes, setVehicleTypes] = useState<
		{
			id: number;
			name: string;
		}[]
	>([]);

	useEffect(() => {
		const fetchVehicleTypes = async () => {
			const vehicleTypes = await getVehicleTypesAction();
			setVehicleTypes(
				vehicleTypes.map((vehicleType) => ({
					id: vehicleType.id,
					name: vehicleType.name,
				})),
			);
		};
		fetchVehicleTypes();
	}, []);

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
							{"AAA-123"}
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
					<Select onValueChange={() => {}}>
						<SelectTrigger id="vehicle-type" className="w-full h-12">
							<SelectValue placeholder="Selecciona un tipo" />
						</SelectTrigger>
						<SelectContent>
							{vehicleTypes.map((vehicleType) => (
								<SelectItem key={vehicleType.id} value={vehicleType.name}>
									{vehicleType.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between pt-6">
				<Button variant="outline" onClick={() => {}}>
					Cancelar
				</Button>
				<Button onClick={() => {}} disabled={false} className="min-w-[140px]">
					<LogIn className="mr-2 h-4 w-4" />
					Registrar Entrada
				</Button>
			</CardFooter>
		</Card>
	);
}
