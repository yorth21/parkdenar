import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

const tursoUrl = process.env.TURSO_CONNECTION_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoToken) {
	throw new Error(
		"Missing required environment variables: TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN",
	);
}

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "turso",
	dbCredentials: {
		url: tursoUrl,
		authToken: tursoToken,
	},
});
