"use client";

import { SettingsModule } from "@/components/settings/settings-module";

export default function SettingsPage() {
	return (
		<>
			<div className="mb-4">
				<h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
				<p className="text-muted-foreground">Configura el sistema</p>
			</div>

			<SettingsModule />
		</>
	);
}
