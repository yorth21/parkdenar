import { BandsTab } from "@/components/settings/tab-content/bands-tab";
import { ExtraRatesTab } from "@/components/settings/tab-content/extra-rates-tab";
import { InitialRatesTab } from "@/components/settings/tab-content/initial-rates-tab";
import { VehicleTypesTab } from "@/components/settings/tab-content/vehicle-types-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentMethodsTab } from "./tab-content/payment-methods-tab";

interface SettingsTabsProps {
	activeTab: string;
	onTabChange: (value: string) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
	return (
		<Tabs value={activeTab} onValueChange={onTabChange}>
			<TabsList className="grid w-full grid-cols-5">
				<TabsTrigger value="vehicles">Tipos de vehículo</TabsTrigger>
				<TabsTrigger value="payment-methods">Métodos de pago</TabsTrigger>
				<TabsTrigger value="time-bands">Bandas horarias</TabsTrigger>
				<TabsTrigger value="initial-rates">Tarifa inicial</TabsTrigger>
				<TabsTrigger value="extra-rates">Tarifa extra</TabsTrigger>
			</TabsList>

			<TabsContent value="vehicles">
				<VehicleTypesTab />
			</TabsContent>

			<TabsContent value="payment-methods">
				<PaymentMethodsTab />
			</TabsContent>

			<TabsContent value="time-bands">
				<BandsTab />
			</TabsContent>

			<TabsContent value="initial-rates">
				<InitialRatesTab />
			</TabsContent>

			<TabsContent value="extra-rates">
				<ExtraRatesTab />
			</TabsContent>
		</Tabs>
	);
}
