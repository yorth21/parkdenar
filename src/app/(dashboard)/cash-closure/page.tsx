import { CashClosureCard } from "@/components/cash-closure/cash-closure-card";

export default function CashClosurePage() {
	return (
		<div className="max-w-2xl mx-auto">
			{/* Header */}
			<div className="mb-4">
				<h1 className="text-3xl font-bold tracking-tight">Cierre de caja</h1>
				<p className="text-muted-foreground">
					Gestiona el cierre de caja del parqueadero
				</p>
			</div>

			<CashClosureCard />
		</div>
	);
}
