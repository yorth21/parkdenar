import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { vehicleTypes } from "@/db/schema";

export type CreateVehicleTypeInput = {
	name: string;
	isActive?: number;
};

export type UpdateVehicleTypeInput = {
	name?: string;
	isActive?: number;
};

export class VehicleTypeRepository {
	// Crear tipo de vehículo
	static async create(input: CreateVehicleTypeInput) {
		const [vehicleType] = await db
			.insert(vehicleTypes)
			.values(input)
			.returning();
		return vehicleType;
	}

	// Obtener tipo de vehículo por ID
	static async findById(id: number) {
		return db
			.select()
			.from(vehicleTypes)
			.where(eq(vehicleTypes.id, id))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener tipo de vehículo por nombre
	static async findByName(name: string) {
		return db
			.select()
			.from(vehicleTypes)
			.where(eq(vehicleTypes.name, name))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener todos los tipos de vehículo
	static async findAll() {
		return db.select().from(vehicleTypes);
	}

	// Obtener tipos de vehículo activos
	static async findAllActive() {
		return db.select().from(vehicleTypes).where(eq(vehicleTypes.isActive, 1));
	}

	// Actualizar tipo de vehículo
	static async update(id: number, input: UpdateVehicleTypeInput) {
		const [updatedVehicleType] = await db
			.update(vehicleTypes)
			.set(input)
			.where(eq(vehicleTypes.id, id))
			.returning();
		return updatedVehicleType;
	}

	// Desactivar tipo de vehículo
	static async deactivate(id: number) {
		return VehicleTypeRepository.update(id, { isActive: 0 });
	}

	// Activar tipo de vehículo
	static async activate(id: number) {
		return VehicleTypeRepository.update(id, { isActive: 1 });
	}

	// Eliminar tipo de vehículo
	static async delete(id: number) {
		const [deletedVehicleType] = await db
			.delete(vehicleTypes)
			.where(eq(vehicleTypes.id, id))
			.returning();
		return deletedVehicleType;
	}

	// Verificar si existe un tipo de vehículo por nombre
	static async existsByName(name: string) {
		const vehicleType = await VehicleTypeRepository.findByName(name);
		return !!vehicleType;
	}

	// Contar tipos de vehículo activos
	static async countActive() {
		const result = await db
			.select({ count: sql<number>`count(*)` })
			.from(vehicleTypes)
			.where(eq(vehicleTypes.isActive, 1));
		return result[0]?.count || 0;
	}

	// Verificar si un tipo de vehículo está activo
	static async isActive(id: number) {
		const vehicleType = await VehicleTypeRepository.findById(id);
		return vehicleType?.isActive === 1;
	}

	// Métodos helpers para convertir entre boolean y number
	static boolToNumber(value: boolean): number {
		return value ? 1 : 0;
	}

	static numberToBool(value: number): boolean {
		return value === 1;
	}
}
