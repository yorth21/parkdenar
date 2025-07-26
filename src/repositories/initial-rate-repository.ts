import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { initialRates, vehicleTypes } from "@/db/schema";

export type CreateInitialRateInput = {
	vehicleTypeId: number;
	amount: number;
	validFrom: Date;
	validTo?: Date;
};

export type UpdateInitialRateInput = {
	amount?: number;
	validTo?: Date;
};

export class InitialRateRepository {
	// Crear tarifa inicial
	static async create(input: CreateInitialRateInput) {
		const [initialRate] = await db
			.insert(initialRates)
			.values({
				vehicleTypeId: input.vehicleTypeId,
				amount: input.amount,
				validFrom: input.validFrom.getTime(),
				validTo: input.validTo?.getTime(),
			})
			.returning();
		return initialRate;
	}

	// Obtener tarifa por ID
	static async findById(id: number) {
		return db
			.select()
			.from(initialRates)
			.where(eq(initialRates.id, id))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener todas las tarifas con nombres de tipos de vehículo
	static async findAll() {
		return db
			.select({
				id: initialRates.id,
				vehicleTypeId: initialRates.vehicleTypeId,
				amount: initialRates.amount,
				validFrom: initialRates.validFrom,
				validTo: initialRates.validTo,
				vehicleTypeName: vehicleTypes.name,
			})
			.from(initialRates)
			.leftJoin(vehicleTypes, eq(initialRates.vehicleTypeId, vehicleTypes.id));
	}

	// Obtener tarifa vigente para un tipo de vehículo en una fecha específica
	static async findCurrentByVehicleType(
		vehicleTypeId: number,
		date: Date = new Date(),
	) {
		const timestamp = date.getTime();

		return db
			.select()
			.from(initialRates)
			.where(
				and(
					eq(initialRates.vehicleTypeId, vehicleTypeId),
					sql`${initialRates.validFrom} <= ${timestamp}`,
					or(
						isNull(initialRates.validTo),
						sql`${initialRates.validTo} >= ${timestamp}`,
					),
				),
			)
			.orderBy(desc(initialRates.validFrom))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener tarifas por tipo de vehículo
	static async findByVehicleType(vehicleTypeId: number) {
		return db
			.select()
			.from(initialRates)
			.where(eq(initialRates.vehicleTypeId, vehicleTypeId))
			.orderBy(desc(initialRates.validFrom));
	}

	// Actualizar tarifa
	static async update(id: number, input: UpdateInitialRateInput) {
		const updateData: any = {};

		if (input.amount !== undefined) {
			updateData.amount = input.amount;
		}

		if (input.validTo !== undefined) {
			updateData.validTo = input.validTo.getTime();
		}

		const [updatedRate] = await db
			.update(initialRates)
			.set(updateData)
			.where(eq(initialRates.id, id))
			.returning();
		return updatedRate;
	}

	// Eliminar tarifa
	static async delete(id: number) {
		const [deletedRate] = await db
			.delete(initialRates)
			.where(eq(initialRates.id, id))
			.returning();
		return deletedRate;
	}

	// Obtener el monto actual para un tipo de vehículo
	static async getCurrentAmount(
		vehicleTypeId: number,
		date: Date = new Date(),
	) {
		const rate = await InitialRateRepository.findCurrentByVehicleType(
			vehicleTypeId,
			date,
		);
		return rate?.amount || 0;
	}
}
