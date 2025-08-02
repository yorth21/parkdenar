import { findAllActiveParkingEntries } from "@/lib/repositories/parking/parking-entry";
import type { GetActiveEntryResponse } from "@/lib/types/parking";
import type { ResponseAction } from "@/lib/types/response-actions";
import { errorToString } from "@/lib/utils";

export async function getActiveEntryAction(): Promise<
	ResponseAction<GetActiveEntryResponse[]>
> {
	const entries = await findAllActiveParkingEntries();
	if (!entries.ok || !entries.data) {
		return {
			ok: false,
			error: errorToString(entries.error, "Error al obtener las entradas"),
		};
	}

	const listEntries: GetActiveEntryResponse[] = entries.data.map((entry) => ({
		id: entry.id,
		plate: entry.plate,
		entryTime: entry.entryTime,
		vehicleTypeId: entry.vehicleTypeId,
		vehicleTypeName: entry.vehicleTypeName,
		userId: entry.userId,
		userName: entry.userName ?? "",
	}));

	return { ok: true, data: listEntries };
}
