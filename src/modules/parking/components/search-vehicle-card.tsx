"use client";

import { Search } from "lucide-react";
import { useParkingStore } from "@/modules/parking/store/parking-store";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function SearchVehicleCard() {
	const { searchPlate, isSearching, setSearchPlate, searchVehicle } =
		useParkingStore();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Buscar Vehículo</CardTitle>
				<CardDescription>
					Ingresa la placa para registrar una entrada o salida.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="plate-search">Número de placa</Label>
					<Input
						id="plate-search"
						placeholder="AAA-123"
						value={searchPlate}
						onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
						disabled={isSearching}
						className="font-mono text-center font-bold tracking-[0.2em]"
						autoFocus={true}
					/>
				</div>
				<Button
					onClick={searchVehicle}
					disabled={isSearching || !searchPlate.trim()}
					className="w-full"
				>
					{isSearching ? (
						"Buscando..."
					) : (
						<>
							<Search className="mr-2 h-4 w-4" />
							Buscar
						</>
					)}
				</Button>
			</CardContent>
		</Card>
	);
}
