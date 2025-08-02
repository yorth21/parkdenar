PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_payment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exit_id` integer,
	`amount` integer NOT NULL,
	`method` text NOT NULL,
	`payment_method_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`notes` text,
	`cash_closure_id` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`exit_id`) REFERENCES `parking_exit`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`cash_closure_id`) REFERENCES `cash_closure`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "payment_amount_nonneg_ck" CHECK("__new_payment"."amount" >= 0),
	CONSTRAINT "payment_method_ck" CHECK("__new_payment"."method" IN ('Cash', 'Card', 'Transfer'))
);
--> statement-breakpoint
INSERT INTO `__new_payment`("id", "exit_id", "amount", "method", "payment_method_id", "user_id", "notes", "cash_closure_id", "created_at") SELECT "id", "exit_id", "amount", "method", "payment_method_id", "user_id", "notes", "cash_closure_id", "created_at" FROM `payment`;--> statement-breakpoint
DROP TABLE `payment`;--> statement-breakpoint
ALTER TABLE `__new_payment` RENAME TO `payment`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `payment_exit_uq` ON `payment` (`exit_id`);