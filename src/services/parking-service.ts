import { UserRepository, VehicleTypeRepository } from "@/repositories";

export type VehicleEntryInput = {
	plate: string;
	vehicleType: "car" | "motorcycle" | "bicycle";
	userId: string;
};

export type VehicleExitInput = {
	plate: string;
	userId: string;
};

export type VehicleSearchResult = {
	found: boolean;
	data?: {
		plate: string;
		vehicleType: string;
		entryTime: Date;
		timeParked: string;
		status: "Open" | "Closed" | "Paid";
	};
};

export type EntryResult = {
	success: boolean;
	message: string;
	data?: {
		entryId: number;
		plate: string;
		entryTime: Date;
	};
};

export type ExitResult = {
	success: boolean;
	message: string;
	data?: {
		plate: string;
		exitTime: Date;
		timeParked: string;
		amount: number;
	};
};

export class ParkingService {
	// Registrar entrada de vehículo
	static async registerEntry(input: VehicleEntryInput): Promise<EntryResult> {
		try {
			// 1. Validar entrada
			const validation = await ParkingService.validateEntry(input);
			if (!validation.isValid) {
				return {
					success: false,
					message: validation.message,
				};
			}

			// 2. Verificar que la placa no esté ya registrada
			const hasActiveEntry = await ParkingService.hasActiveEntry(input.plate);
			if (hasActiveEntry) {
				return {
					success: false,
					message:
						"Este vehículo ya tiene una entrada activa en el parqueadero",
				};
			}

			// 3. Obtener tipo de vehículo
			const vehicleType = await ParkingService.getVehicleTypeByName(
				input.vehicleType,
			);
			if (!vehicleType) {
				return {
					success: false,
					message: "Tipo de vehículo no válido",
				};
			}

			// 4. TODO: Obtener tarifa inicial actual
			// const initialRate = await InitialRateRepository.findCurrentByVehicleType(vehicleType.id);

			// 5. TODO: Crear entrada en base de datos
			// const entry = await ParkingEntryRepository.create({
			//   plate: input.plate,
			//   vehicleTypeId: vehicleType.id,
			//   initialRateId: initialRate.id,
			//   userId: input.userId,
			// });

			// Por ahora simulamos el resultado
			const entryTime = new Date();
			return {
				success: true,
				message: "Entrada registrada exitosamente",
				data: {
					entryId: Math.floor(Math.random() * 1000), // Simulado
					plate: input.plate.toUpperCase(),
					entryTime,
				},
			};
		} catch (error) {
			console.error("Error registrando entrada:", error);
			return {
				success: false,
				message: "Error interno del servidor",
			};
		}
	}

	// Registrar salida de vehículo
	static async registerExit(input: VehicleExitInput): Promise<ExitResult> {
		try {
			// 1. Buscar entrada activa
			const activeEntry = await ParkingService.findActiveEntry(input.plate);
			if (!activeEntry) {
				return {
					success: false,
					message: "No se encontró una entrada activa para esta placa",
				};
			}

			// 2. Calcular tiempo y monto
			const exitTime = new Date();
			const timeParked = ParkingService.calculateTimeParked(
				activeEntry.entryTime,
				exitTime,
			);

			// TODO: Usar RateCalculationService para calcular el monto real
			const amount = ParkingService.calculateParkingFee(activeEntry, exitTime);

			// 3. TODO: Crear registro de salida y actualizar entrada
			// await ParkingExitRepository.create({
			//   entryId: activeEntry.id,
			//   userId: input.userId,
			//   exitTime: exitTime.getTime(),
			//   calculatedAmount: amount,
			// });

			return {
				success: true,
				message: "Salida registrada exitosamente",
				data: {
					plate: input.plate.toUpperCase(),
					exitTime,
					timeParked,
					amount,
				},
			};
		} catch (error) {
			console.error("Error registrando salida:", error);
			return {
				success: false,
				message: "Error interno del servidor",
			};
		}
	}

	// Buscar vehículo por placa
	static async searchVehicle(plate: string): Promise<VehicleSearchResult> {
		try {
			const activeEntry = await ParkingService.findActiveEntry(plate);

			if (!activeEntry) {
				return {
					found: false,
				};
			}

			const timeParked = ParkingService.calculateTimeParked(
				activeEntry.entryTime,
				new Date(),
			);

			return {
				found: true,
				data: {
					plate: activeEntry.plate,
					vehicleType: activeEntry.vehicleType || "Desconocido",
					entryTime: activeEntry.entryTime,
					timeParked,
					status: activeEntry.status,
				},
			};
		} catch (error) {
			console.error("Error buscando vehículo:", error);
			return {
				found: false,
			};
		}
	}

	// Obtener estado actual del parqueadero
	static async getParkingStatus() {
		try {
			// TODO: Implementar con repositories reales
			return {
				totalSpaces: 100, // Configuración
				occupiedSpaces: 25, // Contar entradas activas
				availableSpaces: 75,
				activeVehicles: [], // Lista de vehículos activos
			};
		} catch (error) {
			console.error("Error obteniendo estado del parqueadero:", error);
			throw new Error("Error obteniendo estado del parqueadero");
		}
	}

	// ========== MÉTODOS PRIVADOS/HELPERS ==========

	private static async validateEntry(input: VehicleEntryInput) {
		// Validar formato de placa
		if (!ParkingService.isValidPlate(input.plate)) {
			return {
				isValid: false,
				message: "Formato de placa no válido",
			};
		}

		// Validar usuario
		const user = await UserRepository.findById(input.userId);
		if (!user || !user.isActive) {
			return {
				isValid: false,
				message: "Usuario no válido o inactivo",
			};
		}

		// Validar tipo de vehículo
		const validTypes = ["car", "motorcycle", "bicycle"];
		if (!validTypes.includes(input.vehicleType)) {
			return {
				isValid: false,
				message: "Tipo de vehículo no válido",
			};
		}

		return {
			isValid: true,
			message: "Validación exitosa",
		};
	}

	private static async hasActiveEntry(plate: string): Promise<boolean> {
		// TODO: Implementar con ParkingEntryRepository
		// return await ParkingEntryRepository.hasActiveEntry(plate);

		// Simulación por ahora
		return Math.random() > 0.7; // 30% chance de tener entrada activa
	}

	private static async findActiveEntry(plate: string) {
		// TODO: Implementar con ParkingEntryRepository
		// return await ParkingEntryRepository.findActiveByPlate(plate);

		// Simulación por ahora
		const hasEntry = Math.random() > 0.5;
		if (!hasEntry) return null;

		return {
			id: 1,
			plate: plate.toUpperCase(),
			vehicleType: "Carro",
			entryTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
			status: "Open" as const,
		};
	}

	private static async getVehicleTypeByName(name: string) {
		const typeMap = {
			car: "Carro",
			motorcycle: "Moto",
			bicycle: "Bicicleta",
		};

		const typeName = typeMap[name as keyof typeof typeMap];
		if (!typeName) return null;

		return await VehicleTypeRepository.findByName(typeName);
	}

	private static isValidPlate(plate: string): boolean {
		// Formato colombiano: AAA-123 o AAA123
		const plateRegex = /^[A-Z]{3}-?\d{3}$/;
		return plateRegex.test(plate.toUpperCase());
	}

	private static calculateTimeParked(entryTime: Date, exitTime: Date): string {
		const diffMs = exitTime.getTime() - entryTime.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

		return `${diffHours}h ${diffMinutes}m`;
	}

	private static calculateParkingFee(entry: any, exitTime: Date): number {
		// Cálculo básico por ahora - TODO: usar RateCalculationService
		const diffMs = exitTime.getTime() - entry.entryTime.getTime();
		const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

		// Tarifa base simulada
		const baseRate = 3000; // $3,000 por hora
		return diffHours * baseRate;
	}
}
