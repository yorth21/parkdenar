import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getInitialRatesAction } from "@/lib/actions/settings/get-initial-rates";
import type { GetInitialRatesResponse } from "@/lib/types/settings";

const initialRatesColumns: ColumnDef<GetInitialRatesResponse>[] = [
	{
		accessorKey: "vehicleTypeName",
		header: "Tipo de vehículo",
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

export function InitialRatesTab() {
	const [initialRates, setInitialRates] = useState<GetInitialRatesResponse[]>(
		[],
	);

	useEffect(() => {
		const getInitialRates = async () => {
			const initialRates = await getInitialRatesAction();
			if (initialRates.ok) {
				setInitialRates(initialRates.data);
			}
		};

		getInitialRates();
	}, []);

	return (
		<div>
			<DataTable columns={initialRatesColumns} data={initialRates} />
		</div>
	);
}
