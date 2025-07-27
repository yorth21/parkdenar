DROP INDEX "authenticator_credential_id_unique";--> statement-breakpoint
DROP INDEX "band_name_uq";--> statement-breakpoint
DROP INDEX "band_active_start_idx";--> statement-breakpoint
DROP INDEX "initial_rate_vehicle_from_uq";--> statement-breakpoint
DROP INDEX "parking_entry_plate_idx";--> statement-breakpoint
DROP INDEX "parking_entry_plate_open_uq";--> statement-breakpoint
DROP INDEX "parking_exit_entry_uq";--> statement-breakpoint
DROP INDEX "parking_exit_time_idx";--> statement-breakpoint
DROP INDEX "payment_exit_uq";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "vehicle_type_name_uq";--> statement-breakpoint
ALTER TABLE `parking_exit` ALTER COLUMN "status" TO "status" text NOT NULL DEFAULT 'NotPaid';--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credential_id_unique` ON `authenticator` (`credential_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `band_name_uq` ON `band` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `band_active_start_idx` ON `band` (`is_active`,`start_hour`);--> statement-breakpoint
CREATE UNIQUE INDEX `initial_rate_vehicle_from_uq` ON `initial_rate` (`vehicle_type_id`,`valid_from`);--> statement-breakpoint
CREATE UNIQUE INDEX `parking_entry_plate_idx` ON `parking_entry` (`plate`);--> statement-breakpoint
CREATE UNIQUE INDEX `parking_entry_plate_open_uq` ON `parking_entry` (`plate`) WHERE "parking_entry"."status" = 'Open';--> statement-breakpoint
CREATE UNIQUE INDEX `parking_exit_entry_uq` ON `parking_exit` (`entry_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `parking_exit_time_idx` ON `parking_exit` (`exit_time`);--> statement-breakpoint
CREATE UNIQUE INDEX `payment_exit_uq` ON `payment` (`exit_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `vehicle_type_name_uq` ON `vehicle_type` (`name`);