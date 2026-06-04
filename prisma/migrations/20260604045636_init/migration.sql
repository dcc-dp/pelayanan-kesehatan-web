-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipes_id` INTEGER NOT NULL,
    `total` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `recipes_id`(`recipes_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_spesialis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `specialis_name` VARCHAR(50) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consultations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `users_id` INTEGER NOT NULL,
    `doctors_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `doctors_fk`(`doctors_id`),
    INDEX `users_fk`(`users_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipes_id` INTEGER NOT NULL,
    `drugs_id` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `jumlah_minum` INTEGER NOT NULL,
    `jumlah_hari` INTEGER NOT NULL,
    `waktu_minum` ENUM('before_eat', 'after_eat') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `drugs_fk`(`drugs_id`),
    INDEX `resep_fk`(`recipes_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `doctor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `users_id` INTEGER NOT NULL,
    `category_spesialis_id` INTEGER NULL,
    `description` TEXT NOT NULL,
    `license` TEXT NOT NULL,
    `certificate` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `category_spesialis_fk`(`category_spesialis_id`),
    INDEX `user_fk`(`users_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drugs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `type` TEXT NOT NULL,
    `price` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `users_id` INTEGER NOT NULL,
    `doctors_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `dokter_fk`(`doctors_id`),
    INDEX `users`(`users_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `users_id` INTEGER NOT NULL,
    `doctors_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME(0) NOT NULL,
    `status` ENUM('proses', 'tolak', 'terima') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `doctorss_fk`(`doctors_id`),
    INDEX `usersss_fk`(`users_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `gender` ENUM('perempuan', 'laki-laki') NULL,
    `birth` DATE NULL,
    `address` TEXT NULL,
    `whatsapp` VARCHAR(13) NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `image` TEXT NULL,
    `role` VARCHAR(50) NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `recipes_fk` FOREIGN KEY (`recipes_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultations` ADD CONSTRAINT `doctors_fk` FOREIGN KEY (`doctors_id`) REFERENCES `doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consultations` ADD CONSTRAINT `users_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `details` ADD CONSTRAINT `drugs_fk` FOREIGN KEY (`drugs_id`) REFERENCES `drugs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `details` ADD CONSTRAINT `resep_fk` FOREIGN KEY (`recipes_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `doctor` ADD CONSTRAINT `category_spesialis_fk` FOREIGN KEY (`category_spesialis_id`) REFERENCES `category_spesialis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `doctor` ADD CONSTRAINT `user_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `dokter_fk` FOREIGN KEY (`doctors_id`) REFERENCES `doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `users` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `doctorss_fk` FOREIGN KEY (`doctors_id`) REFERENCES `doctor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `usersss_fk` FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
