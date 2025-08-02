CREATE TABLE `cash_closure_total` (
	`closure_id` integer NOT NULL,
	`payment_method_id` integer NOT NULL,
	`amount` integer NOT NULL,
	PRIMARY KEY(`closure_id`, `payment_method_id`),
	FOREIGN KEY (`closure_id`) REFERENCES `cash_closure`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `cash_closure` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`user_id` text NOT NULL,
	`cash_counted` integer,
	`discrepancy` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `cash_closure_user_idx` ON `cash_closure` (`user_id`);--> statement-breakpoint
CREATE TABLE `payment_method` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_method_code_unique` ON `payment_method` (`code`);--> statement-breakpoint
CREATE INDEX `payment_method_code_idx` ON `payment_method` (`code`);--> statement-breakpoint
ALTER TABLE `payment` ADD `cash_closure_id` integer REFERENCES cash_closure(id);