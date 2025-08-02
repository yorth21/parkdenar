"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema de validación con Zod
const loginSchema = z.object({
	email: z.email("Ingresa un email válido"),
	password: z
		.string()
		.min(1, "La contraseña es requerida")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleCredentialsLogin = async (data: LoginForm) => {
		setLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				setError("Credenciales inválidas. Verifica tu email y contraseña.");
			} else {
				router.push("/home");
				router.refresh();
			}
		} catch (_err) {
			setError("Error al iniciar sesión. Intenta nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
							<Car className="w-7 h-7 text-white" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
					<CardDescription>
						Accede al sistema de gestión de Parky
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleCredentialsLogin)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<div className="relative">
												<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input
													placeholder="tu@email.com"
													className="pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contraseña</FormLabel>
										<FormControl>
											<div className="relative">
												<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input
													type="password"
													placeholder="Tu contraseña"
													className="pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{error && (
								<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
									{error}
								</div>
							)}

							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Accediendo...
									</>
								) : (
									"Acceder al Sistema"
								)}
							</Button>
						</form>
					</Form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							¿No tienes credenciales?{" "}
							<Link
								href="#"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Contacta al administrador
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
