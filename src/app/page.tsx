import { Car, Clock, DollarSign, FileText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui/button";

export default async function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
			{/* Header */}
			<header className="container mx-auto px-4 py-6">
				<nav className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
							<Car className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">ParkDenar</h1>
							<p className="text-sm text-gray-500">Sistema de Gestión</p>
						</div>
					</div>

					<Link
						className={buttonVariants({ variant: "default", size: "lg" })}
						href="/login"
					>
						Acceder al Sistema
					</Link>
				</nav>
			</header>

			{/* Hero Section - Funcional */}
			<main className="container mx-auto px-4 py-8 lg:py-16">
				<div className="text-center max-w-4xl mx-auto mb-16">
					<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
						Sistema de Gestión para
						<span className="text-blue-600"> Parqueaderos</span>
					</h2>
					<p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
						Plataforma integral para el control de entrada, salida, tarifas y
						reportes de vehículos. Diseñada para operarios y administradores de
						parqueaderos.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link
							className={buttonVariants({ variant: "default", size: "lg" })}
							href="/login"
						>
							Iniciar Sesión
						</Link>

						<Link
							className={buttonVariants({ variant: "outline", size: "lg" })}
							href="#demo"
						>
							Solicitar Demo
						</Link>
					</div>
				</div>

				{/* Features Section - Específicas para parqueaderos */}
				<section className="mb-20 lg:mb-32">
					<h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
						Funcionalidades del Sistema
					</h3>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
						<div className="text-center p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
							<div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
								<Car className="w-7 h-7 text-green-600" />
							</div>
							<h4 className="text-lg font-semibold text-gray-900 mb-2">
								Control de Vehículos
							</h4>
							<p className="text-gray-600 text-sm">
								Registro de entrada y salida de vehículos con datos completos y
								trazabilidad.
							</p>
						</div>

						<div className="text-center p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
							<div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
								<Clock className="w-7 h-7 text-blue-600" />
							</div>
							<h4 className="text-lg font-semibold text-gray-900 mb-2">
								Control de Tiempo
							</h4>
							<p className="text-gray-600 text-sm">
								Cálculo automático de tiempo de permanencia y tarifas por hora o
								fracción.
							</p>
						</div>

						<div className="text-center p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
							<div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
								<DollarSign className="w-7 h-7 text-purple-600" />
							</div>
							<h4 className="text-lg font-semibold text-gray-900 mb-2">
								Gestión de Tarifas
							</h4>
							<p className="text-gray-600 text-sm">
								Configuración flexible de tarifas por tipo de vehículo, hora y
								día de la semana.
							</p>
						</div>

						<div className="text-center p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
							<div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
								<FileText className="w-7 h-7 text-orange-600" />
							</div>
							<h4 className="text-lg font-semibold text-gray-900 mb-2">
								Reportes Detallados
							</h4>
							<p className="text-gray-600 text-sm">
								Informes de ingresos, ocupación, vehículos más frecuentes y
								estadísticas operativas.
							</p>
						</div>
					</div>
				</section>

				{/* Demo Section */}
				<section id="demo" className="text-center">
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 lg:p-12 text-white max-w-4xl mx-auto">
						<h3 className="text-3xl lg:text-4xl font-bold mb-4">
							¿Interesado en implementar ParkDenar?
						</h3>
						<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
							Solicita una demostración personalizada y conoce cómo nuestro
							sistema puede optimizar la operación de tu parqueadero.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Link
								className={buttonVariants({
									variant: "secondary",
									size: "lg",
								})}
								href="mailto:contacto@parkdenar.com?subject=Solicitud de Demo"
							>
								Solicitar Demo
							</Link>

							<Link
								className={buttonVariants({
									variant: "secondary",
									size: "lg",
								})}
								href="tel:+57-300-123-4567"
							>
								Llamar Ahora
							</Link>
						</div>
					</div>
				</section>
			</main>

			{/* Footer - Simplificado */}
			<footer className="bg-gray-900 text-white py-8 mt-20">
				<div className="container mx-auto px-4 text-center">
					<div className="flex items-center justify-center space-x-3 mb-4">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
							<Car className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold">ParkDenar</span>
						<span className="text-gray-400">|</span>
						<span className="text-gray-400">Sistema de Gestión</span>
					</div>
					<p className="text-gray-400 text-sm mb-4">
						Solución profesional para la gestión integral de parqueaderos
					</p>
					<div className="text-sm text-gray-400">
						© 2025 ParkDenar - Yorth21. Sistema especializado para operaciones
						de parqueaderos.
					</div>
				</div>
			</footer>
		</div>
	);
}
