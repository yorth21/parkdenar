import { activeEntrysColumns } from "@/components/parking/active-entrys-columns";
import { DataTable } from "@/components/shared/data-table";
import { getActiveEntryAction } from "@/lib/actions/parking/get-active-entry";

export default async function VehiclesInsidePage() {
	const activeEntries = await getActiveEntryAction();

	if (!activeEntries.ok) {
		return <div>Error: {activeEntries.error}</div>;
	}

	return (
		<>
			{/* Header */}
			<div className="mb-4">
				<h1 className="text-3xl font-bold tracking-tight">Vehículos dentro</h1>
				<p className="text-muted-foreground">
					Gestiona los vehículos dentro del sistema
				</p>
			</div>

			<DataTable columns={activeEntrysColumns} data={activeEntries.data} />
		</>
	);
}
