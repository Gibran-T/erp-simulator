CREATE TABLE `scenario_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`scenarioId` varchar(64) NOT NULL,
	`moduleId` varchar(64) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`hintsUsed` int NOT NULL DEFAULT 0,
	`wrongAttempts` int NOT NULL DEFAULT 0,
	`examMode` boolean NOT NULL DEFAULT false,
	`durationSeconds` int NOT NULL DEFAULT 0,
	`stepBreakdown` text,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scenario_attempts_id` PRIMARY KEY(`id`)
);
