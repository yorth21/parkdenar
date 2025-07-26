import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { bands } from "@/db/schema";

export type CreateBandInput = {
	name: string;
	startHour: number;
	endHour: number;
	isActive?: number;
};

export type UpdateBandInput = {
	name?: string;
	startHour?: number;
	endHour?: number;
	isActive?: number;
};

export class BandRepository {
	// Crear banda horaria
	static async create(input: CreateBandInput) {
		const [band] = await db.insert(bands).values(input).returning();
		return band;
	}

	// Obtener banda por ID
	static async findById(id: number) {
		return db
			.select()
			.from(bands)
			.where(eq(bands.id, id))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener banda por nombre
	static async findByName(name: string) {
		return db
			.select()
			.from(bands)
			.where(eq(bands.name, name))
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener todas las bandas
	static async findAll() {
		return db.select().from(bands);
	}

	// Obtener bandas activas
	static async findAllActive() {
		return db.select().from(bands).where(eq(bands.isActive, 1));
	}

	// Obtener banda activa para una hora específica
	static async findActiveByHour(hour: number) {
		return db
			.select()
			.from(bands)
			.where(
				and(
					eq(bands.isActive, 1),
					lte(bands.startHour, hour),
					gte(bands.endHour, hour),
				),
			)
			.limit(1)
			.then((rows) => rows[0] || null);
	}

	// Obtener bandas que se superponen con un rango horario
	static async findOverlapping(startHour: number, endHour: number) {
		return db
			.select()
			.from(bands)
			.where(
				and(
					eq(bands.isActive, 1),
					sql`NOT (${bands.endHour} <= ${startHour} OR ${bands.startHour} >= ${endHour})`,
				),
			);
	}

	// Actualizar banda
	static async update(id: number, input: UpdateBandInput) {
		const [updatedBand] = await db
			.update(bands)
			.set(input)
			.where(eq(bands.id, id))
			.returning();
		return updatedBand;
	}

	// Desactivar banda
	static async deactivate(id: number) {
		return BandRepository.update(id, { isActive: 0 });
	}

	// Activar banda
	static async activate(id: number) {
		return BandRepository.update(id, { isActive: 1 });
	}

	// Eliminar banda
	static async delete(id: number) {
		const [deletedBand] = await db
			.delete(bands)
			.where(eq(bands.id, id))
			.returning();
		return deletedBand;
	}

	// Verificar si existe una banda por nombre
	static async existsByName(name: string) {
		const band = await BandRepository.findByName(name);
		return !!band;
	}

	// Contar bandas activas
	static async countActive() {
		const result = await db
			.select({ count: sql<number>`count(*)` })
			.from(bands)
			.where(eq(bands.isActive, 1));
		return result[0]?.count || 0;
	}

	// Verificar si una banda está activa
	static async isActive(id: number) {
		const band = await BandRepository.findById(id);
		return band?.isActive === 1;
	}

	// Validar que no haya superposición de horarios
	static async hasOverlap(
		startHour: number,
		endHour: number,
		excludeId?: number,
	) {
		const conditions = [
			eq(bands.isActive, 1),
			sql`NOT (${bands.endHour} <= ${startHour} OR ${bands.startHour} >= ${endHour})`,
		];

		if (excludeId) {
			conditions.push(sql`${bands.id} != ${excludeId}`);
		}

		const overlapping = await db
			.select()
			.from(bands)
			.where(and(...conditions));

		return overlapping.length > 0;
	}

	// Obtener bandas ordenadas por hora de inicio
	static async findAllActiveOrderByStartHour() {
		return db
			.select()
			.from(bands)
			.where(eq(bands.isActive, 1))
			.orderBy(bands.startHour);
	}

	// Métodos helpers
	static boolToNumber(value: boolean): number {
		return value ? 1 : 0;
	}

	static numberToBool(value: number): boolean {
		return value === 1;
	}
}
