"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GetUsersResponse } from "@/lib/types/users";

export const userColumns: ColumnDef<GetUsersResponse>[] = [
	{
		accessorKey: "name",
		header: "Nombre",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "role",
		header: "Rol",
		cell: ({ getValue }) => {
			const role = getValue() as string;
			return (
				<Badge variant={role === "admin" ? "default" : "secondary"}>
					{role === "admin" ? "Admin" : "Operador"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "isActive",
		header: "Estado",
		cell: ({ getValue }) => {
			const isActive = getValue() as boolean;
			return (
				<Badge
					className={`gap-1 font-medium ${
						isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
					}`}
				>
					<span
						className={`w-2 h-2 rounded-full inline-block ${
							isActive ? "bg-white" : "bg-white"
						} border-2 ${isActive ? "border-green-600" : "border-red-600"}`}
					/>
					{isActive ? "Activo" : "Inactivo"}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		header: "Acciones",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex gap-2">
					{/* Botón de editar... */}
					<Button size="sm" variant="ghost" onClick={() => console.log(user)}>
						<Pencil className="w-4 h-4" />
					</Button>
					<Button
						size="sm"
						variant="destructive"
						onClick={() => console.log(user)}
					>
						<Trash className="w-4 h-4" />
					</Button>
				</div>
			);
		},
	},
];
