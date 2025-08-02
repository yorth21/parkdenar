"use server";

import { findAllActiveBands } from "@/lib/repositories/settings/band";
import type { Band } from "@/lib/types/parking-schema";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function getBandsAction(): Promise<ResponseAction<Band[]>> {
	const bands = await findAllActiveBands();
	if (!bands.ok) {
		return {
			ok: false,
			error: errorToString(bands.error, "Error al obtener las bandas"),
		};
	}

	const listBands = bands.data?.map(
		(band): Band => ({
			id: band.id,
			name: band.name,
			startHour: band.startHour,
			endHour: band.endHour,
			isActive: band.isActive === 1,
		}),
	);
	return { ok: true, data: listBands ?? [] };
}
