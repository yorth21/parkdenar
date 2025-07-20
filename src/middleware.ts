import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	// Rutas de autenticación
	const isAuthRoute = nextUrl.pathname.startsWith("/login");

	// Solo manejar redirecciones de rutas de auth
	// Si está logueado y trata de acceder a rutas de auth, redirigir a home
	if (isAuthRoute && isLoggedIn) {
		return NextResponse.redirect(new URL("/home", nextUrl));
	}

	// Permitir acceso en cualquier otro caso
	// La protección de rutas del grupo (dashboard) se maneja en el layout
	return NextResponse.next();
});

// Configurar qué rutas debe procesar el middleware
export const config = {
	matcher: [
		// Solo procesar rutas de autenticación
		"/login",
		"/register",
	],
};
