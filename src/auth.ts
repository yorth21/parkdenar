import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { db } from "@/db";
import { users } from "@/db/schema";

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

				const user = await db
					.select()
					.from(users)
					.where(eq(users.email, credentials.email as string))
					.limit(1);

				if (!user[0]) {
					return null;
				}

				const isValidPassword = await bcrypt.compare(
					credentials.password as string,
					user[0].password || "",
				);

				if (!isValidPassword) {
					return null;
				}

				return {
					id: user[0].id,
					email: user[0].email,
					name: user[0].name,
					image: user[0].image,
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
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user && token?.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
});
