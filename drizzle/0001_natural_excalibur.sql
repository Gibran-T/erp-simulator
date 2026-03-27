CREATE TABLE `cohorts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`program` varchar(200),
	`semester` varchar(50),
	`year` int,
	`status` enum('active','completed','planned') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cohorts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `erp_students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`cohortId` int,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastActive` timestamp,
	CONSTRAINT `erp_students_id` PRIMARY KEY(`id`),
	CONSTRAINT `erp_students_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `erp_teachers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`role` enum('teacher','admin') NOT NULL DEFAULT 'teacher',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastActive` timestamp,
	CONSTRAINT `erp_teachers_id` PRIMARY KEY(`id`),
	CONSTRAINT `erp_teachers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `quiz_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`moduleId` varchar(50) NOT NULL,
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenario_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`scenarioId` varchar(100) NOT NULL,
	`moduleId` varchar(50) NOT NULL,
	`score` int NOT NULL,
	`maxScore` int NOT NULL DEFAULT 100,
	`hintsUsed` int NOT NULL DEFAULT 0,
	`wrongAttempts` int NOT NULL DEFAULT 0,
	`examMode` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scenario_scores_id` PRIMARY KEY(`id`)
);
