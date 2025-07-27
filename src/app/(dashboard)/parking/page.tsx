"use client";

import { EmptyStateCard } from "@/modules/parking/components/empty-state-card";
import { RegisterEntryCard } from "@/modules/parking/components/register-entry-card";
import { RegisterExitCard } from "@/modules/parking/components/register-exit-card";
import { SearchVehicleCard } from "@/modules/parking/components/search-vehicle-card";
import { useVehicleSearchStore } from "@/modules/parking/stores/vehicle-search-store";

export default function ParkingPage() {
	const { vehicleSearchResult } = useVehicleSearchStore();

	return (
		<>
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Control de Vehículos
				</h1>
				<p className="text-muted-foreground">
					Gestiona las entradas y salidas del parqueadero
				</p>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Columna Izquierda - Búsqueda */}
				<div>
					<SearchVehicleCard />
				</div>

				{/* Columna Derecha - Registro de Entrada/Salida */}
				<div>
					{vehicleSearchResult === null ? (
						<EmptyStateCard />
					) : vehicleSearchResult.found === false ? (
						<RegisterEntryCard />
					) : (
						<RegisterExitCard />
					)}
				</div>
			</div>
		</>
	);
}
