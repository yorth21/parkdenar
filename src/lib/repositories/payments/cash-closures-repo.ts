import { desc } from "drizzle-orm";
import { db } from "@/db";
import { cashClosures } from "@/db/schema";

export const findLastEntryCashClosure = async () => {
	try {
		const [lastEntry] = await db
			.select()
			.from(cashClosures)
			.orderBy(desc(cashClosures.endTime))
			.limit(1);

		if (!lastEntry) {
			return { ok: false, error: "No se encontró el último cierre de caja" };
		}

		return { ok: true, data: lastEntry };
	} catch (error) {
		return { ok: false, error: error };
	}
};
