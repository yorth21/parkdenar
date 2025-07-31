"use client";

import { Clock, Loader2, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plate } from "@/components/parking/plate";
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
import { createEntryAction } from "@/lib/actions/parking/create-entry";
import type { VehicleType } from "@/lib/types/parking-schema";
import { useSearchVehicleStore } from "@/store/search-vehicle-store";
import { useVehicleTypesStore } from "@/store/vehicle-types-store";

export function RegisterEntryCard() {
	const vehicleTypes = useVehicleTypesStore((state) => state.vehicleTypes);
	const errorFetchVehicleTypes = useVehicleTypesStore((state) => state.error);
	const searchedVehicle = useSearchVehicleStore(
		(state) => state.searchedVehicle,
	);
	const clearSearchedVehicle = useSearchVehicleStore((state) => state.clear);
	const [selectedVehicleType, setSelectedVehicleType] =
		useState<VehicleType | null>(null);

	const [isLoading, setIsLoading] = useState(false);

	const { data: session } = useSession();

	useEffect(() => {
		if (errorFetchVehicleTypes) {
			toast.error(errorFetchVehicleTypes);
		}
	}, [errorFetchVehicleTypes]);

	const handleRegisterEntry = async () => {
		setIsLoading(true);

		if (!session?.user?.id) {
			toast.error("Por favor, inicia sesión para registrar una entrada");
			setIsLoading(false);
			return;
		}

		if (!searchedVehicle?.plate || !selectedVehicleType) {
			toast.error("Por favor, selecciona un tipo de vehículo");
			setIsLoading(false);
			return;
		}

		const response = await createEntryAction({
			plate: searchedVehicle.plate,
			vehicleTypeId: selectedVehicleType.id,
			userId: session.user.id,
		});

		if (response.ok) {
			toast.success("Entrada registrada correctamente");
			clearSearchedVehicle();
		} else {
			toast.error(response.error);
		}
		setIsLoading(false);
	};

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
				<Plate plate={searchedVehicle?.plate} />

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
				<div className="space-y-2">
					<Label htmlFor="vehicle-type" className="text-base font-medium">
						Tipo de Vehículo
					</Label>
					<Select
						onValueChange={(value) => {
							const vehicleType = vehicleTypes.find(
								(vehicleType) => vehicleType.id.toString() === value,
							);
							setSelectedVehicleType(vehicleType ?? null);
						}}
					>
						<SelectTrigger id="vehicle-type" className="w-full">
							<SelectValue placeholder="Selecciona un tipo" />
						</SelectTrigger>
						<SelectContent>
							{vehicleTypes.map((vehicleType) => (
								<SelectItem
									key={vehicleType.id}
									value={vehicleType.id.toString()}
								>
									{vehicleType.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between pt-2">
				<Button variant="outline" onClick={clearSearchedVehicle}>
					Cancelar
				</Button>
				<Button
					onClick={handleRegisterEntry}
					disabled={
						!searchedVehicle?.plate || !selectedVehicleType || isLoading
					}
					className="min-w-[140px]"
				>
					{isLoading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<LogIn className="mr-2 h-4 w-4" />
					)}
					Registrar Entrada
				</Button>
			</CardFooter>
		</Card>
	);
}
