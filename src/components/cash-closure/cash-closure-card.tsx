"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { confirmClosureAction } from "@/lib/actions/payments/confirm-closure";
import { generateClosurePreviewAction } from "@/lib/actions/payments/generate-closure-preview";
import type { GenerateClosurePreviewResponse } from "@/lib/types/payments";
import { formatCurrency } from "@/lib/utils";

export function CashClosureCard() {
	const { data: session } = useSession();
	const router = useRouter();
	const [countedCash, setCountedCash] = useState(0);
	const [notes, setNotes] = useState("");

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [preview, setPreview] = useState<GenerateClosurePreviewResponse | null>(
		null,
	);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (!session?.user?.id) {
			toast.error("Por favor, inicia sesión para confirmar el cierre de caja");
			setIsSubmitting(false);
			return;
		}

		const response = await confirmClosureAction({
			cashCounted: countedCash * 100,
			notes,
			userId: session.user.id,
		});

		if (response.ok) {
			toast.success("Cierre de caja confirmado correctamente");
			router.push("/home");
		} else {
			toast.error(response.error);
		}

		setIsSubmitting(false);
	};

	useEffect(() => {
		const fetchPreview = async () => {
			const preview = await generateClosurePreviewAction();
			if (preview.ok) {
				setPreview(preview.data);
			}
		};
		fetchPreview();
	}, []);

	if (!preview) return null;

	return (
		<div className="max-w-2xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>Cierre de caja – Hoy</CardTitle>
					<p className="text-sm text-gray-600">
						Desde {preview.startTime.toLocaleString()} hasta{" "}
						{preview.endTime.toLocaleString()}
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Totales por método */}
					<div className="space-y-3">
						{preview.totals.map((total) => (
							<div
								key={total.paymentMethodId}
								className="flex justify-between items-center"
							>
								<span className="font-medium">{total.paymentMethodName}</span>
								<span className="text-lg font-semibold">
									{formatCurrency(total.amount)}
								</span>
							</div>
						))}
					</div>

					<Separator />

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Efectivo contado */}
						<div className="space-y-2">
							<Label htmlFor="countedCash">Efectivo contado</Label>
							<Input
								type="text"
								inputMode="decimal"
								min={0}
								placeholder="Valor a cobrar"
								value={
									countedCash === undefined || countedCash === null
										? ""
										: Number(countedCash).toLocaleString("es-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0,
												maximumFractionDigits: 0,
											})
								}
								onChange={(e) => {
									const raw = e.target.value.replace(/[^\d]/g, "");
									setCountedCash(raw ? Number(raw) : 0);
								}}
							/>
						</div>

						{/* Diferencia */}
						{countedCash > 0 && (
							<div className="flex justify-between items-center">
								<span className="font-medium">Diferencia</span>
								<Badge
									variant={
										preview.amount - countedCash * 100 === 0
											? "default"
											: "destructive"
									}
								>
									{formatCurrency(preview.amount - countedCash * 100)}
								</Badge>
							</div>
						)}

						{/* Notas */}
						<div className="space-y-2">
							<Label htmlFor="notes">Notas (opcional)</Label>
							<Textarea
								id="notes"
								placeholder="Observaciones del cierre..."
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={countedCash === 0 || isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Procesando...
								</>
							) : (
								"Confirmar cierre"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
