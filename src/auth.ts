import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
	session: { strategy: "jwt" },
	adapter: DrizzleAdapter(db),
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
		}),
	],
});
