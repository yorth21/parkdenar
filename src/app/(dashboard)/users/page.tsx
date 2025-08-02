import { DataTable } from "@/components/shared/data-table";
import { userColumns } from "@/components/users/user-columns";
import { getUsersAction } from "@/lib/actions/users/get-users-action";

export default async function UsersPage() {
	const users = await getUsersAction();

	if (!users.ok) {
		return <div>{users.error}</div>;
	}

	return (
		<>
			{/* Header */}
			<div className="mb-4">
				<h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
				<p className="text-muted-foreground">
					Gestiona los usuarios del sistema
				</p>
			</div>

			<DataTable columns={userColumns} data={users.data ?? []} />
		</>
	);
}
