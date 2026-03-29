CREATE TABLE `reflection_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`scenarioId` varchar(64) NOT NULL,
	`questionId` varchar(64) NOT NULL,
	`answer` text NOT NULL,
	`lang` varchar(4) NOT NULL DEFAULT 'fr',
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reflection_answers_id` PRIMARY KEY(`id`)
);
