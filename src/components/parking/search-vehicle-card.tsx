"use client";

import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchVehicleStore } from "@/store/search-vehicle-store";

export function SearchVehicleCard() {
	const inputRef = useRef<HTMLInputElement>(null);
	const loading = useSearchVehicleStore((state) => state.loading);
	const searchVehicle = useSearchVehicleStore((state) => state.searchVehicle);

	const [plate, setPlate] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		await searchVehicle(plate.toUpperCase().trim());
		inputRef.current?.focus();
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
						onChange={(e) => {
							const value = e.target.value
								.toUpperCase()
								.replace(/[^A-Z0-9]/g, "");
							setPlate(value);
						}}
						onPaste={(e) => {
							const paste = e.clipboardData.getData("text").toUpperCase();
							if (!/^[A-Z0-9]*$/.test(paste)) {
								e.preventDefault();
							}
						}}
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
