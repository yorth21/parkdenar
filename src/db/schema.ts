import { sql } from "drizzle-orm";
import {
	integer as bool,
	check,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// Auth
export const users = sqliteTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	email: text("email").unique(),
	password: text("password"),
	role: text("role").notNull().default("user"),
	emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
	image: text("image"),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

export const accounts = sqliteTable(
	"account",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => [
		primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	],
);

export const sessions = sqliteTable("session", {
	sessionToken: text("session_token").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
	"verification_token",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
	},
	(verificationToken) => [
		primaryKey({
			columns: [verificationToken.identifier, verificationToken.token],
		}),
	],
);

export const authenticators = sqliteTable(
	"authenticator",
	{
		credentialID: text("credential_id").notNull().unique(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		providerAccountId: text("provider_account_id").notNull(),
		credentialPublicKey: text("credential_public_key").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credential_device_type").notNull(),
		credentialBackedUp: integer("credential_backed_up", {
			mode: "boolean",
		}).notNull(),
		transports: text("transports"),
	},
	(authenticator) => [
		primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	],
);

// Parking
export const vehicleTypes = sqliteTable(
	"vehicle_type",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		isActive: bool("is_active").notNull().default(1),
	},
	(vehicleType) => [uniqueIndex("vehicle_type_name_uq").on(vehicleType.name)],
);

export const bands = sqliteTable(
	"band",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		startHour: integer("start_hour").notNull(),
		endHour: integer("end_hour").notNull(),
		isActive: bool("is_active").notNull().default(1),
	},
	(band) => [
		index("band_name_idx").on(band.name),
		check(
			"band_hour_range_ck",
			sql`${band.startHour} >= 0 AND ${band.endHour} <= 23 AND ${band.startHour} < ${band.endHour}`,
		),
		uniqueIndex("band_active_start_idx").on(band.isActive, band.startHour),
	],
);

export const initialRates = sqliteTable(
	"initial_rate",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		vehicleTypeId: integer("vehicle_type_id")
			.notNull()
			.references(() => vehicleTypes.id, { onDelete: "restrict" }),
		amount: integer("amount").notNull(),
		validFrom: integer("valid_from", { mode: "timestamp_ms" }).notNull(),
		validTo: integer("valid_to", { mode: "timestamp_ms" }),
	},
	(initialRate) => [
		uniqueIndex("initial_rate_vehicle_from_uq").on(
			initialRate.vehicleTypeId,
			initialRate.validFrom,
		),
		check("initial_rate_amount_nonneg_ck", sql`${initialRate.amount} >= 0`),
		check(
			"init_rate_valid_range_ck",
			sql`(${initialRate.validTo} IS NULL) OR (${initialRate.validTo} > ${initialRate.validFrom})`,
		),
	],
);

export const extraRates = sqliteTable(
	"extra_rate",
	{
		bandId: integer("band_id")
			.notNull()
			.references(() => bands.id, { onDelete: "restrict" }),
		vehicleTypeId: integer("vehicle_type_id")
			.notNull()
			.references(() => vehicleTypes.id, { onDelete: "restrict" }),
		amount: integer("amount").notNull(),
		validFrom: integer("valid_from", { mode: "timestamp_ms" }).notNull(),
		validTo: integer("valid_to", { mode: "timestamp_ms" }),
	},
	(extraRate) => [
		primaryKey({
			columns: [extraRate.bandId, extraRate.vehicleTypeId, extraRate.validFrom],
		}),
		check("extra_rate_amount_nonneg_ck", sql`${extraRate.amount} >= 0`),
		check(
			"extra_rate_valid_range_ck",
			sql`(${extraRate.validTo} IS NULL) OR (${extraRate.validTo} > ${extraRate.validFrom})`,
		),
	],
);

export const parkingEntries = sqliteTable(
	"parking_entry",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		plate: text("plate").notNull(),
		vehicleTypeId: integer("vehicle_type_id")
			.notNull()
			.references(() => vehicleTypes.id, { onDelete: "restrict" }),
		entryTime: integer("entry_time", { mode: "timestamp_ms" }).notNull(),
		initialRateId: integer("initial_rate_id")
			.notNull()
			.references(() => initialRates.id, { onDelete: "restrict" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		status: text("status")
			.$type<"Open" | "Closed" | "Paid">()
			.notNull()
			.default("Open"),
	},
	(parkingEntry) => [
		index("parking_entry_plate_idx").on(parkingEntry.plate),
		// Índice único condicional para placas abiertas
		uniqueIndex("parking_entry_plate_open_uq")
			.on(parkingEntry.plate)
			.where(sql`${parkingEntry.status} = 'Open'`),
		check(
			"parking_entry_status_ck",
			sql`${parkingEntry.status} IN ('Open', 'Closed', 'Paid')`,
		),
	],
);

export const parkingExit = sqliteTable(
	"parking_exit",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		entryId: integer("entry_id")
			.notNull()
			.references(() => parkingEntries.id, { onDelete: "restrict" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		exitTime: integer("exit_time", { mode: "timestamp_ms" }).notNull(),
		calculatedAmount: integer("calculated_amount").notNull(),
		status: text("status")
			.$type<"Paid" | "NotPaid" | "Voided">()
			.notNull()
			.default("NotPaid"),
	},
	(parkingExit) => [
		uniqueIndex("parking_exit_entry_uq").on(parkingExit.entryId),
		index("parking_exit_time_idx").on(parkingExit.exitTime),
		check(
			"parking_exit_status_ck",
			sql`${parkingExit.status} IN ('Paid', 'Voided', 'NotPaid')`,
		),
	],
);

export const paymentMethods = sqliteTable(
	"payment_method",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		code: text("code").notNull().unique(), // 'CASH', 'CARD', 'NEQUI', etc.
		name: text("name").notNull(), // ‘Efectivo’, ‘Tarjeta’, ‘Nequi’
		isActive: bool("is_active").notNull().default(1),
	},
	(t) => [index("payment_method_code_idx").on(t.code)],
);

export const cashClosures = sqliteTable(
	"cash_closure",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		startTime: integer("start_time", { mode: "timestamp_ms" }).notNull(),
		endTime: integer("end_time", { mode: "timestamp_ms" }).notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		cashCounted: integer("cash_counted"), // lo que contó el operador
		discrepancy: integer("discrepancy"), // cashCounted – totalCash
		notes: text("notes"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(tbl) => [index("cash_closure_user_idx").on(tbl.userId)],
);

export const cashClosureTotals = sqliteTable(
	"cash_closure_total",
	{
		closureId: integer("closure_id")
			.notNull()
			.references(() => cashClosures.id, { onDelete: "cascade" }),
		paymentMethodId: integer("payment_method_id")
			.notNull()
			.references(() => paymentMethods.id, { onDelete: "restrict" }),
		amount: integer("amount").notNull(),
	},
	(t) => [primaryKey({ columns: [t.closureId, t.paymentMethodId] })],
);

export const payments = sqliteTable(
	"payment",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		exitId: integer("exit_id").references(() => parkingExit.id, {
			onDelete: "restrict",
		}),
		amount: integer("amount").notNull(),
		method: text("method").$type<"Cash" | "Card" | "Transfer">().notNull(),
		paymentMethodId: integer("payment_method_id")
			.notNull()
			.references(() => paymentMethods.id, { onDelete: "restrict" }),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "restrict" }),
		notes: text("notes"),
		cashClosureId: integer("cash_closure_id").references(
			() => cashClosures.id,
			{ onDelete: "set null" },
		),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(payment) => [
		uniqueIndex("payment_exit_uq").on(payment.exitId),
		check("payment_amount_nonneg_ck", sql`${payment.amount} >= 0`),
		check(
			"payment_method_ck",
			sql`${payment.method} IN ('Cash', 'Card', 'Transfer')`,
		),
	],
);
