import { drizzle } from "drizzle-orm/libsql";

const tursoUrl = process.env.TURSO_CONNECTION_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
	throw new Error(
		"Missing required environment variables: TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN",
	);
}

export const db = drizzle({
	connection: {
		url: tursoUrl,
		authToken: tursoToken,
	},
});
