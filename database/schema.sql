v1

-- 1. Khởi tạo Database cho dự án (Nếu chưa có)
CREATE DATABASE IF NOT EXISTS python_ai_learning_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE python_ai_learning_db;

-- --------------------------------------------------------
-- 2. TẠO CÁC BẢNG DỮ LIỆU
-- --------------------------------------------------------

-- Bảng 1: Người dùng & Phân quyền
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `hashed_password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NULL,
    `avatar_url` VARCHAR(500) NULL,
    `role` ENUM('admin', 'teacher', 'student') DEFAULT 'student',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Bảng 2: Khóa học tổng quan
CREATE TABLE IF NOT EXISTS `courses` (
    `id` INT AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `thumbnail_url` VARCHAR(500) NULL,
    `level` ENUM('basic', 'intermediate', 'advanced') DEFAULT 'basic',
    `is_published` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Bảng 3: Chương học (Gom nhóm bài học trong khóa)
CREATE TABLE IF NOT EXISTS `chapters` (
    `id` INT AUTO_INCREMENT,
    `course_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `order_index` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_chapters_courses` 
        FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng 4: Bài học chi tiết
CREATE TABLE IF NOT EXISTS `lessons` (
    `id` INT AUTO_INCREMENT,
    `chapter_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `video_url` VARCHAR(500) NOT NULL,
    `code_stub` TEXT NULL,
    `transcript` LONGTEXT NULL,
    `order_index` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_lessons_chapters` 
        FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng 5: Quản lý hàng đợi tiến trình AI Pipeline của Admin
CREATE TABLE IF NOT EXISTS `video_jobs` (
    `id` INT AUTO_INCREMENT,
    `lesson_id` INT NOT NULL,
    `status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    `progress` INT DEFAULT 0,
    `error_message` TEXT NULL,
    `started_at` TIMESTAMP NULL,
    `completed_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_jobs_lessons` 
        FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng 6: Phiên hội thoại Chatbot
CREATE TABLE IF NOT EXISTS `chat_sessions` (
    `id` INT AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `lesson_id` INT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_sessions_users` 
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_sessions_lessons` 
        FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bảng 7: Nội dung tin nhắn chat chi tiết
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` INT AUTO_INCREMENT,
    `session_id` INT NOT NULL,
    `sender` ENUM('user', 'ai') NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_messages_sessions` 
        FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;