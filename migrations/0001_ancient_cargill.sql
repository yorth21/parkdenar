CREATE TABLE `band` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`start_hour` integer NOT NULL,
	`end_hour` integer NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	CONSTRAINT "band_hour_range_ck" CHECK("band"."start_hour" >= 0 AND "band"."end_hour" <= 24 AND "band"."start_hour" < "band"."end_hour")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `band_name_uq` ON `band` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `band_active_start_idx` ON `band` (`is_active`,`start_hour`);--> statement-breakpoint
CREATE TABLE `extra_rate` (
	`band_id` integer NOT NULL,
	`vehicle_type_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`valid_from` integer NOT NULL,
	`valid_to` integer,
	PRIMARY KEY(`band_id`, `vehicle_type_id`, `valid_from`),
	FOREIGN KEY (`band_id`) REFERENCES `band`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_type`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "extra_rate_amount_nonneg_ck" CHECK("extra_rate"."amount" >= 0),
	CONSTRAINT "extra_rate_valid_range_ck" CHECK(("extra_rate"."valid_to" IS NULL) OR ("extra_rate"."valid_to" > "extra_rate"."valid_from"))
);
--> statement-breakpoint
CREATE TABLE `initial_rate` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_type_id` integer NOT NULL,
	`amount` integer NOT NULL,
	`valid_from` integer NOT NULL,
	`valid_to` integer,
	FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_type`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "initial_rate_amount_nonneg_ck" CHECK("initial_rate"."amount" >= 0),
	CONSTRAINT "init_rate_valid_range_ck" CHECK(("initial_rate"."valid_to" IS NULL) OR ("initial_rate"."valid_to" > "initial_rate"."valid_from"))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `initial_rate_vehicle_from_uq` ON `initial_rate` (`vehicle_type_id`,`valid_from`);--> statement-breakpoint
CREATE TABLE `parking_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`plate` text NOT NULL,
	`vehicle_type_id` integer NOT NULL,
	`entry_time` integer NOT NULL,
	`initial_rate_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'Open' NOT NULL,
	FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_type`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`initial_rate_id`) REFERENCES `initial_rate`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "parking_entry_status_ck" CHECK("parking_entry"."status" IN ('Open', 'Closed', 'Paid'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `parking_entry_plate_idx` ON `parking_entry` (`plate`);--> statement-breakpoint
CREATE UNIQUE INDEX `parking_entry_plate_open_uq` ON `parking_entry` (`plate`) WHERE "parking_entry"."status" = 'Open';--> statement-breakpoint
CREATE TABLE `parking_exit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entry_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`exit_time` integer NOT NULL,
	`calculated_amount` integer NOT NULL,
	`status` text DEFAULT 'Paid' NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `parking_entry`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "parking_exit_status_ck" CHECK("parking_exit"."status" IN ('Paid', 'Voided'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `parking_exit_entry_uq` ON `parking_exit` (`entry_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `parking_exit_time_idx` ON `parking_exit` (`exit_time`);--> statement-breakpoint
CREATE TABLE `payment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exit_id` integer,
	`amount` integer NOT NULL,
	`method` text NOT NULL,
	`user_id` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`exit_id`) REFERENCES `parking_exit`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "payment_amount_nonneg_ck" CHECK("payment"."amount" >= 0),
	CONSTRAINT "payment_method_ck" CHECK("payment"."method" IN ('Cash', 'Card', 'Transfer'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_exit_uq` ON `payment` (`exit_id`);--> statement-breakpoint
CREATE TABLE `vehicle_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_type_name_uq` ON `vehicle_type` (`name`);--> statement-breakpoint
ALTER TABLE `account` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `userId`;