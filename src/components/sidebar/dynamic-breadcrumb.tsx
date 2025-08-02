"use client";

import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
	"/home": "Inicio",
	"/parking": "Parqueadero",
	"/vehicles-inside": "Vehículos dentro",
	"/cash-closure": "Cierre de caja",
	"/cash-closure/preview": "Previsualización",
	"/cash-closure/confirm": "Confirmar",
	"/settings": "Configuración",
	"/users": "Usuarios",
};

export function DynamicBreadcrumb() {
	const pathname = usePathname();

	const currentPageLabel = routeLabels[pathname] || "Inicio";
	const isDashboardRoot = pathname === "/home";

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className="hidden md:block">
					<BreadcrumbLink href="/home">Inicio</BreadcrumbLink>
				</BreadcrumbItem>
				{!isDashboardRoot && (
					<>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
						</BreadcrumbItem>
					</>
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
