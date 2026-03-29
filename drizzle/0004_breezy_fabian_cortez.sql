CREATE TABLE `step_executions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attemptId` int NOT NULL,
	`studentId` int NOT NULL,
	`scenarioId` varchar(64) NOT NULL,
	`stepId` varchar(64) NOT NULL,
	`stepNumber` int NOT NULL,
	`result` enum('ok','error','hint') NOT NULL,
	`wrongAttempts` int NOT NULL DEFAULT 0,
	`hintUsed` boolean NOT NULL DEFAULT false,
	`durationSeconds` int NOT NULL DEFAULT 0,
	`executedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `step_executions_id` PRIMARY KEY(`id`)
);
