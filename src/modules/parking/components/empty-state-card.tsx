"use client";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

export function EmptyStateCard() {
	return (
		<Card className="h-fit">
			<CardContent className="flex flex-col items-center justify-center py-12 text-center">
				<Search className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-medium text-muted-foreground mb-2">
					Busca un vehículo
				</h3>
				<p className="text-sm text-muted-foreground">
					Ingresa una placa en el campo de búsqueda para registrar una entrada o
					salida.
				</p>
			</CardContent>
		</Card>
	);
}
