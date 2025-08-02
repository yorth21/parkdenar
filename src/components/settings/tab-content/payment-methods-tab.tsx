import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { getPaymentMethodsAction } from "@/lib/actions/settings/get-payment-methods";
import type { PaymentMethod } from "@/lib/types/parking-schema";

const paymentMethodsColumns: ColumnDef<PaymentMethod>[] = [
	{
		header: "Nombre",
		accessorKey: "name",
	},
	{
		header: "Código",
		accessorKey: "code",
	},
	{
		header: "Activo",
		accessorKey: "isActive",
	},
];

export function PaymentMethodsTab() {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

	useEffect(() => {
		const getPaymentMethods = async () => {
			const paymentMethods = await getPaymentMethodsAction();
			if (paymentMethods.ok) {
				setPaymentMethods(paymentMethods.data);
			}
		};

		getPaymentMethods();
	}, []);

	return (
		<div>
			<DataTable columns={paymentMethodsColumns} data={paymentMethods} />
		</div>
	);
}
