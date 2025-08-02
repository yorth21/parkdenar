"use client";

import { useEffect } from "react";
import { EmptyStateCard } from "@/components/parking/empty-state-card";
import { ListRecentHistory } from "@/components/parking/list-recent-history";
import { RegisterEntryCard } from "@/components/parking/register-entry-card";
import { RegisterExitCard } from "@/components/parking/register-exit-card";
import { SearchVehicleCard } from "@/components/parking/search-vehicle-card";
import { useSearchVehicleStore } from "@/store/search-vehicle-store";
import { useVehicleTypesStore } from "@/store/vehicle-types-store";

export default function ParkingPage() {
	const searchedVehicle = useSearchVehicleStore(
		(state) => state.searchedVehicle,
	);
	const clearSearchedVehicle = useSearchVehicleStore((state) => state.clear);

	const fetchVehicleTypes = useVehicleTypesStore(
		(state) => state.fetchVehicleTypes,
	);

	useEffect(() => {
		fetchVehicleTypes();

		clearSearchedVehicle();
	}, [fetchVehicleTypes, clearSearchedVehicle]);

	return (
		<>
			{/* Header */}
			<div className="mb-4">
				<h1 className="text-3xl font-bold tracking-tight">
					Control de Vehículos
				</h1>
				<p className="text-muted-foreground">
					Gestiona las entradas y salidas del parqueadero
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{/* Columna Izquierda - Búsqueda */}
				<div className="flex flex-col gap-4">
					<SearchVehicleCard />

					{searchedVehicle === null ? (
						<EmptyStateCard />
					) : searchedVehicle.found === false ? (
						<RegisterEntryCard />
					) : (
						<RegisterExitCard />
					)}
				</div>

				{/* Columna Derecha - Historial de Entradas */}
				<div>
					<ListRecentHistory />
				</div>
			</div>
		</>
	);
}
