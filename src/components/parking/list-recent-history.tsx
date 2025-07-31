"use client";

import { Car, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRecentHistoryAction } from "@/lib/actions/parking/recent-history";
import type {
	ParkingEntryStatus,
	ParkingExitStatus,
	RecentHistory,
} from "@/lib/types/parking-schema";
import { useSearchVehicleStore } from "@/store/search-vehicle-store";

/* ---------- Estilos de badge con buen contraste ---------- */
const badgeStyle: Record<ParkingEntryStatus | ParkingExitStatus, string> = {
	Open: "bg-green-500/15  text-green-700  border-green-400/40",
	Closed: "bg-gray-500/15  text-gray-800   border-gray-400/40",
	Paid: "bg-blue-500/15   text-blue-700   border-blue-400/40",
	NotPaid: "bg-yellow-500/20 text-yellow-800 border-yellow-500/40",
	Voided: "bg-red-500/15    text-red-700    border-red-400/40",
};

/* ---------- Etiquetas legibles ---------- */
const badgeLabel: Record<ParkingEntryStatus | ParkingExitStatus, string> = {
	Open: "Abierto",
	Closed: "Cerrado",
	Paid: "Pagado",
	NotPaid: "Pendiente",
	Voided: "Anulado",
};

export function ListRecentHistory() {
	const [recentHistory, setRecentHistory] = useState<RecentHistory[]>([]);
	const clearCount = useSearchVehicleStore((s) => s.clearCount);

	// biome-ignore lint/correctness/useExhaustiveDependencies: clearCount
	useEffect(() => {
		getRecentHistoryAction().then((res) => {
			if (res.ok) setRecentHistory(res.data);
		});
	}, [clearCount]);

	return (
		<Card className="h-full bg-background/70 border border-muted shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Clock className="h-4 w-4 text-muted-foreground" />
					Últimas Entradas
				</CardTitle>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="space-y-1">
					{recentHistory.map((item) => (
						<div
							key={item.entryId}
							className="flex items-center justify-between gap-4
                         px-3 py-2 rounded-md border border-transparent
                         hover:bg-accent/40 hover:border-accent transition-colors"
						>
							{/* Columna izquierda ------------------------------------------------ */}
							<div className="flex items-center gap-2 min-w-0">
								<Car className="h-4 w-4 text-accent-foreground/70 shrink-0" />

								<span className="font-mono font-semibold text-sm truncate">
									{item.plate}
								</span>

								<Badge
									variant="outline"
									className={`text-xs ${badgeStyle[item.status]}`}
								>
									{badgeLabel[item.status]}
								</Badge>
							</div>

							{/* Columna derecha -------------------------------------------------- */}
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								<span className="hidden sm:inline">{item.vehicleType}</span>

								<span className="tabular-nums">
									{item.operationTime.toLocaleTimeString("es-CO", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
