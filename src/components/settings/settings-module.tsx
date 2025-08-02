import { useState } from "react";
import { SettingsTabs } from "./settings-tabs";

export function SettingsModule() {
	const [activeTab, setActiveTab] = useState("vehicles");

	const handleTabChange = (value: string) => {
		setActiveTab(value);
	};

	return (
		<div>
			<SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
		</div>
	);
}
