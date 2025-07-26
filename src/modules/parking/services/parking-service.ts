import type { ParkingEntryStatus } from "@/modules/parking/enums/parking";
import {
	createParkingEntry,
	findActiveParkingEntryByPlate,
	hasActiveParkingEntry,
} from "@/modules/parking/repositories/parking-entry-repository";
import type {
	EntryResult,
	ExitResult,
	VehicleEntryInput,
	VehicleExitInput,
	VehicleSearchResult,
} from "@/modules/parking/types/parking";
import { findActiveBandByHour } from "@/modules/settings/repositories/band-repository";
import { findCurrentExtraRate } from "@/modules/settings/repositories/extra-rate-repository";
import { findCurrentInitialRateByVehicleType } from "@/modules/settings/repositories/initial-rate-repository";

// Search vehicle by plate
export async function searchVehicle(
	plate: string,
): Promise<VehicleSearchResult> {
	try {
		const activeEntry = await findActiveParkingEntryByPlate(plate);
		if (!activeEntry) {
			return { found: false };
		}

		const timeParked = calculateTimeParked(activeEntry.entryTime, new Date());
		return {
			found: true,
			data: {
				plate: activeEntry.plate,
				vehicleType: activeEntry.vehicleTypeName || "Desconocido",
				entryTime: activeEntry.entryTime,
				timeParked,
			},
		};
	} catch (_error) {
		return { found: false };
	}
}

// Register entry
export async function registerEntry(
	input: VehicleEntryInput,
): Promise<EntryResult> {
	try {
		// Verificar que la placa no esté ya registrada
		const hasActive = await hasActiveParkingEntry(input.plate);
		if (hasActive) {
			return {
				success: false,
				message: "Este vehículo ya tiene una entrada activa en el parqueadero",
			};
		}

		const initialRate = await findCurrentInitialRateByVehicleType(
			input.vehicleTypeId,
		);
		if (!initialRate) {
			return {
				success: false,
				message: "No se encontró una tarifa inicial para este tipo de vehículo",
			};
		}

		const entry = await createParkingEntry({
			plate: input.plate,
			vehicleTypeId: input.vehicleTypeId,
			initialRateId: initialRate.id,
			userId: input.userId,
		});

		return {
			success: true,
			message: "Entrada registrada exitosamente",
			data: {
				entryId: entry.id,
				plate: input.plate.toUpperCase(),
				entryTime: entry.entryTime,
			},
		};
	} catch (_error) {
		return {
			success: false,
			message: "Error interno del servidor",
		};
	}
}

export async function registerExit(
	input: VehicleExitInput,
): Promise<ExitResult> {
	try {
		const activeEntry = await findActiveParkingEntryByPlate(input.plate);
		if (!activeEntry) {
			return {
				success: false,
				message: "No se encontró una entrada activa para esta placa",
			};
		}

		const exitTime = new Date();
		const timeParked = calculateTimeParked(activeEntry.entryTime, exitTime);
		const amount = await calculateParkingAmount(
			activeEntry.entryTime,
			exitTime,
			activeEntry.vehicleTypeId,
		);

		// TODO: Crear registro de salida y actualizar entrada
		// await ParkingExitRepository.create({ ... });

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
	} catch (_error) {
		return {
			success: false,
			message: "Error interno del servidor",
		};
	}
}

export async function getParkingStatus() {
	try {
		return {
			totalSpaces: 100,
			occupiedSpaces: 25,
			availableSpaces: 75,
			activeVehicles: [],
		};
	} catch (error) {
		console.error("Error obteniendo estado del parqueadero:", error);
		throw new Error("Error obteniendo estado del parqueadero");
	}
}

/* ===================== HELPERS ===================== */

function calculateTimeParked(entryTime: Date, exitTime: Date): string {
	const diffMs = exitTime.getTime() - entryTime.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
	const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	return `${diffHours}h ${diffMinutes}m`;
}

async function calculateParkingAmount(
	entryTime: Date,
	exitTime: Date,
	vehicleTypeId: number,
): Promise<number> {
	try {
		// 1. Calcular tiempo total en horas (redondeado hacia arriba)
		const diffMs = exitTime.getTime() - entryTime.getTime();
		const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));

		// Si es menos de 1 hora, cobrar como 1 hora
		if (totalHours <= 1) {
			const initialRate =
				await findCurrentInitialRateByVehicleType(vehicleTypeId);
			return initialRate?.amount || 0;
		}

		// 2. Obtener la tarifa inicial (primera hora)
		const initialRate =
			await findCurrentInitialRateByVehicleType(vehicleTypeId);
		if (!initialRate) {
			throw new Error("No se encontró tarifa inicial para el tipo de vehículo");
		}

		let totalAmount = initialRate.amount;

		// 3. Calcular horas adicionales por bandas horarias
		const additionalHours = totalHours - 1;
		let currentTime = new Date(entryTime.getTime() + 60 * 60 * 1000); // Hora 2

		for (let hour = 0; hour < additionalHours; hour++) {
			const currentHour = currentTime.getHours();

			// Encontrar la banda horaria activa para esta hora
			const band = await findActiveBandByHour(currentHour);
			if (!band) {
				throw new Error(
					`No se encontró banda activa para la hora ${currentHour}`,
				);
			}

			// Encontrar la tarifa extra para esta banda y tipo de vehículo
			const extraRate = await findCurrentExtraRate(
				band.id,
				vehicleTypeId,
				currentTime,
			);
			if (extraRate) {
				totalAmount += extraRate.amount;
			} else {
				throw new Error(
					`No se encontró tarifa extra para banda ${band.id} y vehículo ${vehicleTypeId}`,
				);
			}

			// Avanzar a la siguiente hora
			currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
		}

		return totalAmount;
	} catch (_error) {
		throw new Error("Error calculando monto del parqueadero");
	}
}
