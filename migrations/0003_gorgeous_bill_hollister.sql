DROP INDEX `band_name_uq`;--> statement-breakpoint
CREATE INDEX `band_name_idx` ON `band` (`name`);--> statement-breakpoint
DROP INDEX `parking_entry_plate_idx`;--> statement-breakpoint
CREATE INDEX `parking_entry_plate_idx` ON `parking_entry` (`plate`);--> statement-breakpoint
DROP INDEX `parking_exit_time_idx`;--> statement-breakpoint
CREATE INDEX `parking_exit_time_idx` ON `parking_exit` (`exit_time`);