"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getRecentHistoryAction } from "@/lib/actions/parking/recent-history";
import type {
	ParkingEntryStatus,
	ParkingExitStatus,
	RecentHistory,
} from "@/lib/types/parking-schema";
import { useSearchVehicleStore } from "@/store/search-vehicle-store";

/* ---------- Status styles ---------- */
const statusStyle: Record<
	ParkingEntryStatus | ParkingExitStatus,
	{ dot: string; text: string }
> = {
	Open: { dot: "bg-green-500", text: "text-green-700" },
	Closed: { dot: "bg-gray-500", text: "text-gray-700" },
	Paid: { dot: "bg-blue-500", text: "text-blue-700" },
	NotPaid: { dot: "bg-yellow-500", text: "text-yellow-700" },
	Voided: { dot: "bg-red-500", text: "text-red-700" },
};

const statusLabel: Record<ParkingEntryStatus | ParkingExitStatus, string> = {
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
			if (res.ok) {
				setRecentHistory(res.data);
			}
		});
	}, [clearCount]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Clock className="h-4 w-4 text-muted-foreground" />
					Actividad Reciente
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-3">
				{recentHistory.length === 0 ? (
					<p className="text-center text-sm text-muted-foreground py-4">
						No hay movimientos recientes
					</p>
				) : (
					recentHistory.map((item) => {
						const st = statusStyle[item.status];
						return (
							<div
								key={item.entryId}
								className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
							>
								<div className="flex items-center gap-3 min-w-0 flex-1">
									{/* Placa */}
									<span className="font-mono tracking-widest font-semibold text-sm">
										{item.plate}
									</span>

									{/* Estado */}
									<div className="flex items-center gap-1">
										<span
											className={`h-2 w-2 rounded-full ${st.dot}`}
											aria-hidden
										/>
										<span className={`text-xs font-medium ${st.text}`}>
											{statusLabel[item.status]}
										</span>
									</div>
								</div>

								{/* Tipo y Hora */}
								<div className="text-right">
									<div className="text-xs text-muted-foreground">
										{item.vehicleType}
									</div>
									<div className="font-mono text-sm">
										{item.operationTime.toLocaleTimeString("es-CO", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								</div>
							</div>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}
