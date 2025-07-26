import { BandRepository } from "@/repositories";

export type RateCalculationInput = {
	vehicleTypeId: number;
	entryTime: Date;
	exitTime: Date;
	initialRateAmount: number;
};

export type RateBreakdown = {
	initialRate: number;
	extraRates: Array<{
		bandName: string;
		hours: number;
		rate: number;
		amount: number;
	}>;
	totalAmount: number;
	totalHours: number;
	totalMinutes: number;
};

export type TimeInBand = {
	bandId: number;
	bandName: string;
	startHour: number;
	endHour: number;
	hoursInBand: number;
};

export class RateCalculationService {
	// Calcular el monto total a pagar
	static async calculateTotalAmount(
		input: RateCalculationInput,
	): Promise<RateBreakdown> {
		try {
			const { entryTime, exitTime, initialRateAmount } = input;

			// 1. Calcular tiempo total
			const totalTime = RateCalculationService.calculateTotalTime(
				entryTime,
				exitTime,
			);

			// 2. Obtener tiempo por banda horaria
			const timeInBands = await RateCalculationService.calculateTimeInBands(
				entryTime,
				exitTime,
			);

			// 3. Calcular tarifas extras por banda
			const extraRates = await RateCalculationService.calculateExtraRates(
				input.vehicleTypeId,
				timeInBands,
			);

			// 4. Calcular total
			const extraAmount = extraRates.reduce(
				(sum, rate) => sum + rate.amount,
				0,
			);
			const totalAmount = initialRateAmount + extraAmount;

			return {
				initialRate: initialRateAmount,
				extraRates,
				totalAmount,
				totalHours: totalTime.hours,
				totalMinutes: totalTime.minutes,
			};
		} catch (error) {
			console.error("Error calculando monto total:", error);
			throw new Error("Error en el cálculo de tarifas");
		}
	}

	// Calcular solo el tiempo transcurrido
	static calculateTotalTime(entryTime: Date, exitTime: Date) {
		const diffMs = exitTime.getTime() - entryTime.getTime();
		const totalMinutes = Math.floor(diffMs / (1000 * 60));
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		return { hours, minutes, totalMinutes };
	}

	// Calcular tiempo que el vehículo estuvo en cada banda horaria
	static async calculateTimeInBands(
		entryTime: Date,
		exitTime: Date,
	): Promise<TimeInBand[]> {
		try {
			// Obtener todas las bandas activas
			const bands = await BandRepository.findAllActiveOrderByStartHour();

			const timeInBands: TimeInBand[] = [];

			for (const band of bands) {
				const hoursInBand = RateCalculationService.calculateHoursInSpecificBand(
					entryTime,
					exitTime,
					band.startHour,
					band.endHour,
				);

				if (hoursInBand > 0) {
					timeInBands.push({
						bandId: band.id,
						bandName: band.name,
						startHour: band.startHour,
						endHour: band.endHour,
						hoursInBand,
					});
				}
			}

			return timeInBands;
		} catch (error) {
			console.error("Error calculando tiempo en bandas:", error);
			return [];
		}
	}

	// Calcular horas que el vehículo estuvo en una banda específica
	static calculateHoursInSpecificBand(
		entryTime: Date,
		exitTime: Date,
		bandStartHour: number,
		bandEndHour: number,
	): number {
		let totalHours = 0;

		// Iterar día por día desde la entrada hasta la salida
		const currentDay = new Date(entryTime);
		const endDay = new Date(exitTime);

		while (currentDay <= endDay) {
			const dayStart = new Date(currentDay);
			dayStart.setHours(bandStartHour, 0, 0, 0);

			const dayEnd = new Date(currentDay);
			dayEnd.setHours(bandEndHour, 0, 0, 0);

			// Calcular intersección entre el periodo de estacionamiento y la banda horaria
			const intersectionStart = new Date(
				Math.max(entryTime.getTime(), dayStart.getTime()),
			);
			const intersectionEnd = new Date(
				Math.min(exitTime.getTime(), dayEnd.getTime()),
			);

			if (intersectionStart < intersectionEnd) {
				const hoursInThisDay =
					(intersectionEnd.getTime() - intersectionStart.getTime()) /
					(1000 * 60 * 60);
				totalHours += hoursInThisDay;
			}

			// Pasar al siguiente día
			currentDay.setDate(currentDay.getDate() + 1);
		}

		return Math.ceil(totalHours); // Redondear hacia arriba
	}

	// Calcular tarifas extras basadas en el tiempo en cada banda
	static async calculateExtraRates(
		vehicleTypeId: number,
		timeInBands: TimeInBand[],
	) {
		const extraRates = [];

		for (const timeInBand of timeInBands) {
			// TODO: Obtener tarifa extra para esta banda y tipo de vehículo
			// const extraRate = await ExtraRateRepository.findCurrentByBandAndVehicleType(
			//   timeInBand.bandId,
			//   vehicleTypeId
			// );

			// Simulación por ahora
			const ratePerHour = RateCalculationService.getSimulatedExtraRate(
				timeInBand.bandName,
			);
			const amount = timeInBand.hoursInBand * ratePerHour;

			if (amount > 0) {
				extraRates.push({
					bandName: timeInBand.bandName,
					hours: timeInBand.hoursInBand,
					rate: ratePerHour,
					amount,
				});
			}
		}

		return extraRates;
	}

	// Obtener una estimación rápida del costo
	static calculateQuickEstimate(vehicleType: string, hours: number): number {
		const baseRates = {
			car: 3000,
			motorcycle: 2000,
			bicycle: 1000,
		};

		const baseRate = baseRates[vehicleType as keyof typeof baseRates] || 3000;
		return hours * baseRate;
	}

	// Validar si es horario pico
	static isPeakHour(date: Date): boolean {
		const hour = date.getHours();
		// Horarios pico: 7-9 AM y 5-7 PM
		return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
	}

	// Formatear tiempo transcurrido para mostrar al usuario
	static formatTimeParked(entryTime: Date, exitTime: Date): string {
		const time = RateCalculationService.calculateTotalTime(entryTime, exitTime);

		if (time.hours === 0) {
			return `${time.minutes}m`;
		} else if (time.minutes === 0) {
			return `${time.hours}h`;
		} else {
			return `${time.hours}h ${time.minutes}m`;
		}
	}

	// ========== MÉTODOS PRIVADOS/HELPERS ==========

	private static getSimulatedExtraRate(bandName: string): number {
		// Simulación de tarifas por banda
		const rateMap: { [key: string]: number } = {
			"Horario Normal": 1000,
			"Horario Pico": 2000,
			"Horario Nocturno": 500,
		};

		return rateMap[bandName] || 1000;
	}

	// Calcular días entre dos fechas
	private static getDaysBetween(startDate: Date, endDate: Date): number {
		const oneDay = 24 * 60 * 60 * 1000;
		return Math.ceil((endDate.getTime() - startDate.getTime()) / oneDay);
	}

	// Verificar si dos periodos de tiempo se superponen
	private static timePeriodsOverlap(
		start1: Date,
		end1: Date,
		start2: Date,
		end2: Date,
	): boolean {
		return start1 < end2 && start2 < end1;
	}
}
