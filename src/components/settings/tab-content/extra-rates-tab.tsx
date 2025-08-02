import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getExtraRatesAction } from "@/lib/actions/settings/get-extra-rates";
import type { GetExtraRatesResponse } from "@/lib/types/settings";

const extraRatesColumns: ColumnDef<GetExtraRatesResponse>[] = [
	{
		accessorKey: "bandName",
		header: "Bandas",
	},
	{
		accessorKey: "vehicleTypeName",
		header: "Tipos de vehículo",
	},
	{
		accessorKey: "amount",
		header: "Monto",
		cell: ({ getValue }) => {
			const amount = getValue() as number;
			return (
				<span>
					{Number(amount / 100).toLocaleString("es-CO", {
						style: "currency",
						currency: "COP",
						minimumFractionDigits: 0,
					})}
				</span>
			);
		},
	},
];

export function ExtraRatesTab() {
	const [extraRates, setExtraRates] = useState<GetExtraRatesResponse[]>([]);

	useEffect(() => {
		const getExtraRates = async () => {
			const extraRates = await getExtraRatesAction();
			if (extraRates.ok) {
				setExtraRates(extraRates.data);
			}
		};

		getExtraRates();
	}, []);

	return (
		<div>
			<DataTable columns={extraRatesColumns} data={extraRates} />
		</div>
	);
}
