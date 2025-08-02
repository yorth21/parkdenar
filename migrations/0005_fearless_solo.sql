ALTER TABLE `payment` ADD `payment_method_id` integer REFERENCES payment_method(id);
--> statement-breakpoint
insert into `payment_method`
    (`code`,`name`)
values
    ('NEQUI', 'Nequi'),
    ('CASH', 'Efectivo'),
    ('CARD', 'Tarjeta'),
    ('TRANSFER', 'Transferencia');
--> statement-breakpoint
UPDATE `payment` SET
    `payment_method_id` = (
        SELECT `id`
        FROM `payment_method`
        WHERE LOWER(`code`) = LOWER(`payment`.`method`))
WHERE
    `payment_method_id` IS NULL;