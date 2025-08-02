import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getBandsAction } from "@/lib/actions/settings/get-bands";
import type { Band } from "@/lib/types/parking-schema";

const bandsColumns: ColumnDef<Band>[] = [
	{
		accessorKey: "name",
		header: "Nombre",
	},
	{
		accessorKey: "startHour",
		header: "Hora de inicio",
	},
	{
		accessorKey: "endHour",
		header: "Hora de fin",
	},
];

export function BandsTab() {
	const [bands, setBands] = useState<Band[]>([]);

	useEffect(() => {
		const getBands = async () => {
			const bands = await getBandsAction();
			if (bands.ok) {
				setBands(bands.data);
			}
		};

		getBands();
	}, []);

	return (
		<div>
			<DataTable columns={bandsColumns} data={bands} />
		</div>
	);
}
