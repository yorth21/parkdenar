PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_parking_exit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entry_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`exit_time` integer NOT NULL,
	`calculated_amount` integer NOT NULL,
	`status` text DEFAULT 'NotPaid' NOT NULL,
	FOREIGN KEY (`entry_id`) REFERENCES `parking_entry`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "parking_exit_status_ck" CHECK("__new_parking_exit"."status" IN ('Paid', 'Voided', 'NotPaid'))
);
--> statement-breakpoint
INSERT INTO `__new_parking_exit`("id", "entry_id", "user_id", "exit_time", "calculated_amount", "status") SELECT "id", "entry_id", "user_id", "exit_time", "calculated_amount", "status" FROM `parking_exit`;--> statement-breakpoint
DROP TABLE `parking_exit`;--> statement-breakpoint
ALTER TABLE `__new_parking_exit` RENAME TO `parking_exit`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `parking_exit_entry_uq` ON `parking_exit` (`entry_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `parking_exit_time_idx` ON `parking_exit` (`exit_time`);