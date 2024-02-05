ALTER TABLE `community`
    CHANGE COLUMN `category_id` `category` VARCHAR(255) NOT NULL;

ALTER TABLE `community`
    MODIFY COLUMN `title` VARCHAR(50) NOT NULL;

ALTER TABLE `community`
    ADD COLUMN `hit` BIGINT DEFAULT 0 AFTER `is_deleted`;

ALTER TABLE `community`
    ADD COLUMN `maxParticipants` INT DEFAULT 0 AFTER `hit`;