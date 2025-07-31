"use server";

import { getRecentHistory } from "@/lib/repositories/parking/recent-history";
import type { RecentHistory } from "@/lib/types/parking-schema";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function getRecentHistoryAction(): Promise<
	ResponseAction<RecentHistory[]>
> {
	try {
		const recentHistory = await getRecentHistory();
		if (!recentHistory.ok) {
			return {
				ok: false,
				error: errorToString(
					recentHistory.error,
					"Error al obtener el historial",
				),
			};
		}

		return { ok: true, data: recentHistory.data };
	} catch (error: unknown) {
		return {
			ok: false,
			error: errorToString(error, "Error al obtener el historial"),
		};
	}
}
