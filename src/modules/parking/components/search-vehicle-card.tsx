"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useVehicleSearchStore } from "../store/vehicle-search-store";

const searchPlateSchema = z.object({
	searchPlate: z.string().min(3, "La placa es requerida"),
});

type SearchPlateSchema = z.infer<typeof searchPlateSchema>;

export function SearchVehicleCard() {
	const { searchVehicle } = useVehicleSearchStore();

	const form = useForm<SearchPlateSchema>({
		resolver: zodResolver(searchPlateSchema),
		defaultValues: {
			searchPlate: "",
		},
	});

	const onSubmit = (data: SearchPlateSchema) => {
		searchVehicle(data.searchPlate);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Buscar Vehículo</CardTitle>
				<CardDescription>
					Ingresa la placa para registrar una entrada o salida.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-4"
					>
						<FormField
							control={form.control}
							name="searchPlate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Número de placa</FormLabel>
									<FormControl>
										<Input
											placeholder="ABC123"
											{...field}
											onChange={(e) =>
												field.onChange(e.target.value.toUpperCase())
											}
											className="font-mono text-center font-bold tracking-[0.2em]"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							<Search className="mr-2 h-4 w-4" />
							Buscar
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
