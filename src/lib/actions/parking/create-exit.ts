"use server";

import {
	findActiveParkingEntryByPlate,
	updateParkingEntryStatus,
} from "@/lib/repositories/parking/parking-entry";
import { createParkingExit } from "@/lib/repositories/parking/parking-exit";
import { findActiveBandByHour } from "@/lib/repositories/settings/band";
import { findCurrentExtraRate } from "@/lib/repositories/settings/extra-rate";
import { findCurrentInitialRateByVehicleType } from "@/lib/repositories/settings/initial-rate";
import type {
	CreateExitRequest,
	CreateExitResponse,
	ParkingCalculationResult,
	ParkingChargeDetail,
} from "@/lib/types/parking";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function createExitAction(
	request: CreateExitRequest,
): Promise<ResponseAction<CreateExitResponse>> {
	try {
		const { plate, userId } = request;

		const activeEntry = await findActiveParkingEntryByPlate(plate);
		if (!activeEntry.ok || !activeEntry.data) {
			return {
				ok: false,
				error: errorToString(activeEntry.error, "Error al buscar la entrada"),
			};
		}

		const exitTime = new Date();

		const { totalAmount, charges } = await calculateParkingAmount(
			activeEntry.data.entryTime,
			exitTime,
			activeEntry.data.vehicleTypeId,
		);

		const registerExit = await createParkingExit({
			entryId: activeEntry.data.id,
			userId,
			exitTime,
			calculatedAmount: totalAmount,
			status: "NotPaid",
		});

		await updateParkingEntryStatus(activeEntry.data.id, "Closed");

		if (!registerExit.ok || !registerExit.data) {
			return {
				ok: false,
				error: errorToString(registerExit.error, "Error al crear la salida"),
			};
		}

		return {
			ok: true,
			data: {
				exit: registerExit.data,
				totalAmount,
				charges,
			},
		};
	} catch (err: unknown) {
		return {
			ok: false,
			error: errorToString(err, "Error al crear la salida"),
		};
	}
}

function getColombianHour(date: Date): number {
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/Bogota",
		hour: "numeric",
		hour12: false,
	});
	return parseInt(formatter.format(date), 10);
}

async function calculateParkingAmount(
	entryTime: Date,
	exitTime: Date,
	vehicleTypeId: number,
): Promise<ParkingCalculationResult> {
	// 1. Calcular tiempo total en horas (redondeado hacia arriba)
	const diffMs = exitTime.getTime() - entryTime.getTime();
	const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));

	// 2. Obtener la tarifa inicial (primera hora)
	const initialRate = await findCurrentInitialRateByVehicleType(vehicleTypeId);
	if (!initialRate.ok || !initialRate.data) {
		throw new Error("No se encontró tarifa inicial para el tipo de vehículo");
	}

	const charges: ParkingChargeDetail[] = [];

	// Si es menos de 1 hora, cobrar como 1 hora
	if (totalHours <= 1) {
		charges.push({
			chargeName: "Tarifa inicial",
			amount: initialRate.data.amount,
		});

		return {
			totalAmount: initialRate.data.amount,
			charges,
		};
	}

	let totalAmount = initialRate.data.amount;

	// 3. Calcular horas adicionales por bandas horarias
	const additionalHours = totalHours - 1;
	let currentTime = new Date(entryTime.getTime() + 60 * 60 * 1000); // Hora 2

	for (let hour = 0; hour < additionalHours; hour++) {
		const currentHour = getColombianHour(currentTime);

		// Encontrar la banda horaria activa para esta hora
		const band = await findActiveBandByHour(currentHour);
		if (!band.ok || !band.data) {
			throw new Error(
				`No se encontró banda activa para la hora ${currentHour}`,
			);
		}

		// Encontrar la tarifa extra para esta banda y tipo de vehículo
		const extraRate = await findCurrentExtraRate(
			band.data.id,
			vehicleTypeId,
			currentTime,
		);
		if (!extraRate.ok || !extraRate.data) {
			throw new Error(
				`No se encontró tarifa extra para banda ${band.data.id} y vehículo ${vehicleTypeId}`,
			);
		}

		totalAmount += extraRate.data.amount;
		charges.push({
			chargeName: band.data.name,
			amount: extraRate.data.amount,
		});

		// Avanzar a la siguiente hora
		currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
	}

	return {
		totalAmount,
		charges,
	};
}
