import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "@/auth";
import { DynamicBreadcrumb } from "@/shared/components/dynamic-breadcrumb";
import { AppSidebar } from "@/shared/components/sidebar/app-sidebar";
import { Separator } from "@/shared/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/shared/components/ui/sidebar";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (!session) {
		redirect("/login");
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<DynamicBreadcrumb />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="max-w-6xl mx-auto w-full">{children}</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
