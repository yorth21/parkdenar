"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { GetActiveEntryResponse } from "@/lib/types/parking";

export const activeEntrysColumns: ColumnDef<GetActiveEntryResponse>[] = [
	{
		header: "Placa",
		accessorKey: "plate",
	},
	{
		header: "Tipo de vehículo",
		accessorKey: "vehicleTypeName",
	},
	{
		header: "Usuario",
		accessorKey: "userName",
	},
	{
		header: "Hora de entrada",
		accessorKey: "entryTime",
		cell: ({ getValue }) => {
			const entryTime = getValue() as Date;
			return <span>{entryTime.toLocaleString()}</span>;
		},
	},
];
