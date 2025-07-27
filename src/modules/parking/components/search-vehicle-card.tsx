"use client";

import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { useVehicleSearchStore } from "@/modules/parking/stores/vehicle-search-store";
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

const plateSchema = z.string().min(3, "La placa es requerida");

export function SearchVehicleCard() {
	const inputRef = useRef<HTMLInputElement>(null);
	const { searchVehicle, loading } = useVehicleSearchStore();

	const [plate, setPlate] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const parsed = plateSchema.safeParse(plate.toUpperCase().trim());
		if (!parsed.success) {
			return;
		}

		await searchVehicle(parsed.data);
		setPlate(""); // limpiar campo
		inputRef.current?.focus(); // volver a enfocar
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Buscar Vehículo</CardTitle>
				<CardDescription>
					Ingresa la placa para registrar una entrada o salida.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Label htmlFor={inputRef.current?.id}>Número de placa</Label>
					<Input
						ref={inputRef}
						placeholder="ABC123"
						value={plate}
						onChange={(e) => setPlate(e.target.value.toUpperCase())}
						className="font-mono text-center font-bold tracking-[0.2em]"
					/>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? (
							<span className="animate-spin mr-2 h-4 w-4 border rounded-full border-t-transparent" />
						) : (
							<Search className="mr-2 h-4 w-4" />
						)}
						{loading ? "Buscando…" : "Buscar"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
