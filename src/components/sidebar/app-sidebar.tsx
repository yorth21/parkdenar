"use client";

import { Car, Home, ParkingMeter } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";

const data = {
	navMain: [
		{
			title: "Inicio",
			url: "/home",
			icon: Home,
		},
		{
			title: "Parqueadero",
			url: "/parking",
			icon: ParkingMeter,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = useSession();

	const user = {
		name: session?.user?.name || "",
		email: session?.user?.email || "",
		avatar: session?.user?.image || "",
	};

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<Link href="/home">
					<div className="flex items-center space-x-3 my-4">
						<div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
							<Car className="w-6 h-6 text-white" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">ParkDenar</h1>
							<p className="text-sm text-gray-500">Sistema de Gestión</p>
						</div>
					</div>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavMain title="Menu" items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	);
}
