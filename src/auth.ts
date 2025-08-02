import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { type DefaultSession } from "next-auth";

import Credentials from "next-auth/providers/credentials";

import { db } from "@/db";
import { findUserByEmail } from "./lib/repositories/users/user-repo";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: "admin" | "user";
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		role: "admin" | "user";
		email: string;
		name: string;
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db),
	session: { strategy: "jwt" },
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const userFound = await findUserByEmail(credentials.email as string);
				if (!userFound.ok || !userFound.data) {
					return null;
				}

				const isValidPassword = await bcrypt.compare(
					credentials.password as string,
					userFound.data.password || "",
				);

				if (!isValidPassword) {
					return null;
				}

				return {
					id: userFound.data.id,
					email: userFound.data.email,
					name: userFound.data.name,
					image: userFound.data.image,
					role: (userFound.data.role as "admin" | "user") ?? "user",
				};
			},
		}),
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user && token?.sub) {
				session.user.id = token.sub;
				session.user.role = token.role as "admin" | "user";
			}
			return session;
		},
	},
});
