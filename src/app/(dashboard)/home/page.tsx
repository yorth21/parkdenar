import { Car, Clock, DollarSign, Users } from "lucide-react";
import { auth } from "@/auth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";

export default async function HomePage() {
	const session = await auth();

	// TODO: Estas estadísticas vendrían de la base de datos
	const stats = {
		vehiclesParked: 45,
		totalSpaces: 100,
		todayRevenue: 125000,
		averageTime: "2h 15m",
	};

	return (
		<>
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Bienvenido de vuelta, {session?.user?.name || "Operario"}
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Vehículos Actuales
						</CardTitle>
						<Car className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.vehiclesParked}</div>
						<p className="text-xs text-muted-foreground">
							de {stats.totalSpaces} espacios
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Ocupación</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{Math.round((stats.vehiclesParked / stats.totalSpaces) * 100)}%
						</div>
						<p className="text-xs text-muted-foreground">capacidad utilizada</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${stats.todayRevenue.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">+12% vs ayer</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tiempo Promedio
						</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.averageTime}</div>
						<p className="text-xs text-muted-foreground">permanencia</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Acciones Rápidas</CardTitle>
						<CardDescription>
							Operaciones más frecuentes del día
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span className="text-sm font-medium">Últimas entradas</span>
							</div>
							<span className="text-sm text-muted-foreground">8 hoy</span>
						</div>
						<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
								<span className="text-sm font-medium">Últimas salidas</span>
							</div>
							<span className="text-sm text-muted-foreground">6 hoy</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Estado del Sistema</CardTitle>
						<CardDescription>
							Información general del parqueadero
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm">Espacios libres</span>
							<span className="text-sm font-medium text-green-600">
								{stats.totalSpaces - stats.vehiclesParked}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm">Sistema</span>
							<span className="text-sm font-medium text-green-600">
								En línea
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm">Última sincronización</span>
							<span className="text-sm text-muted-foreground">Hace 2 min</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
