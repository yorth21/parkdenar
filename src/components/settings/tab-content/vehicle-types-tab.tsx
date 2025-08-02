"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getVehicleTypesAction } from "@/lib/actions/settings/get-vehicle-types";
import type { VehicleType } from "@/lib/types/parking-schema";

const vehicleTypesColumns: ColumnDef<VehicleType>[] = [
	{
		accessorKey: "name",
		header: "Nombre",
	},
];

export function VehicleTypesTab() {
	const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

	useEffect(() => {
		const getVehicleTypes = async () => {
			const vehicleTypes = await getVehicleTypesAction();
			if (vehicleTypes.ok) {
				setVehicleTypes(vehicleTypes.data);
			}
		};

		getVehicleTypes();
	}, []);

	return (
		<div>
			<DataTable columns={vehicleTypesColumns} data={vehicleTypes} />
		</div>
	);
}
