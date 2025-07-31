import { desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { parkingEntries, parkingExit, vehicleTypes } from "@/db/schema";
import type { RecentHistory } from "@/lib/types/parking-schema";
import type { RepositoryResponse } from "@/lib/types/response-actions";

function getStartOfColombianDayMs(): number {
	const nowInBogota = new Date(
		new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
	);

	nowInBogota.setHours(0, 0, 0, 0);

	return nowInBogota.getTime();
}

export async function getRecentHistory(): Promise<
	RepositoryResponse<RecentHistory[]>
> {
	try {
		const recentHistory = await db
			.select({
				entryId: parkingEntries.id,
				plate: parkingEntries.plate,
				vehicleType: vehicleTypes.name,
				status: sql<
					RecentHistory["status"]
				>`coalesce(${parkingExit.status}, ${parkingEntries.status})`.as(
					"status",
				),
				operationTime:
					sql<number>`coalesce(${parkingExit.exitTime}, ${parkingEntries.entryTime})`
						.mapWith((v) => new Date(Number(v)))
						.as("operation_time"),
			})
			.from(parkingEntries)
			.leftJoin(parkingExit, eq(parkingEntries.id, parkingExit.entryId))
			.innerJoin(
				vehicleTypes,
				eq(parkingEntries.vehicleTypeId, vehicleTypes.id),
			)
			.where(
				gte(
					sql`coalesce(${parkingExit.exitTime}, ${parkingEntries.entryTime})`,
					getStartOfColombianDayMs(),
				),
			)
			.orderBy(
				desc(
					sql`coalesce(${parkingExit.exitTime}, ${parkingEntries.entryTime})`,
				),
			)
			.limit(8);
		return { ok: true, data: recentHistory as RecentHistory[] };
	} catch (error: unknown) {
		return { ok: false, error };
	}
}
