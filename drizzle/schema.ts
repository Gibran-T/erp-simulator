import {
  int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});


export const scenarioAttempts = mysqlTable("scenario_attempts", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  scenarioId: varchar("scenarioId", { length: 64 }).notNull(),
  moduleId: varchar("moduleId", { length: 64 }).notNull(),
  score: int("score").notNull().default(0),
  hintsUsed: int("hintsUsed").notNull().default(0),
  wrongAttempts: int("wrongAttempts").notNull().default(0),
  examMode: boolean("examMode").notNull().default(false),
  durationSeconds: int("durationSeconds").notNull().default(0),
  stepBreakdown: text("stepBreakdown"), // JSON: [{stepId, correct, hintsUsed, wrongAttempts}]
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});
export type ScenarioAttempt = typeof scenarioAttempts.$inferSelect;
export type InsertScenarioAttempt = typeof scenarioAttempts.$inferInsert;

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================
// ERP Platform — Cohorts
// ============================================================
export const cohorts = mysqlTable("cohorts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  program: varchar("program", { length: 200 }),
  semester: varchar("semester", { length: 50 }),
  year: int("year"),
  status: mysqlEnum("status", ["active", "completed", "planned"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cohort = typeof cohorts.$inferSelect;
export type InsertCohort = typeof cohorts.$inferInsert;

// ============================================================
// ERP Platform — Student accounts (teacher-managed)
// ============================================================
export const erpStudents = mysqlTable("erp_students", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  cohortId: int("cohortId"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastActive: timestamp("lastActive"),
});

export type ErpStudent = typeof erpStudents.$inferSelect;
export type InsertErpStudent = typeof erpStudents.$inferInsert;

// ============================================================
// ERP Platform — Teacher accounts
// ============================================================
export const erpTeachers = mysqlTable("erp_teachers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["teacher", "admin"]).default("teacher").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastActive: timestamp("lastActive"),
});

export type ErpTeacher = typeof erpTeachers.$inferSelect;
export type InsertErpTeacher = typeof erpTeachers.$inferInsert;

// ============================================================
// ERP Platform — Scenario scores (per student per scenario)
// ============================================================
export const scenarioScores = mysqlTable("scenario_scores", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  scenarioId: varchar("scenarioId", { length: 100 }).notNull(),
  moduleId: varchar("moduleId", { length: 50 }).notNull(),
  score: int("score").notNull(),
  maxScore: int("maxScore").default(100).notNull(),
  hintsUsed: int("hintsUsed").default(0).notNull(),
  wrongAttempts: int("wrongAttempts").default(0).notNull(),
  examMode: boolean("examMode").default(false).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type ScenarioScore = typeof scenarioScores.$inferSelect;
export type InsertScenarioScore = typeof scenarioScores.$inferInsert;

// ============================================================
// ERP Platform — Quiz scores (per student per module)
// ============================================================
export const quizScores = mysqlTable("quiz_scores", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  moduleId: varchar("moduleId", { length: 50 }).notNull(),
  score: int("score").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type QuizScore = typeof quizScores.$inferSelect;
export type InsertQuizScore = typeof quizScores.$inferInsert;

// ============================================================
// ERP Platform — Reflection question answers
// ============================================================
export const reflectionAnswers = mysqlTable("reflection_answers", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  scenarioId: varchar("scenarioId", { length: 64 }).notNull(),
  questionId: varchar("questionId", { length: 64 }).notNull(),
  answer: text("answer").notNull(),
  lang: varchar("lang", { length: 4 }).default("fr").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type ReflectionAnswer = typeof reflectionAnswers.$inferSelect;
export type InsertReflectionAnswer = typeof reflectionAnswers.$inferInsert;

// ============================================================
// ERP Platform — Step-level execution tracking
// Records every step result (ok/error/hint) per attempt
// ============================================================
export const stepExecutions = mysqlTable("step_executions", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attemptId").notNull(), // FK → scenario_attempts.id
  studentId: int("studentId").notNull(),
  scenarioId: varchar("scenarioId", { length: 64 }).notNull(),
  stepId: varchar("stepId", { length: 64 }).notNull(),
  stepNumber: int("stepNumber").notNull(),
  result: mysqlEnum("result", ["ok", "error", "hint"]).notNull(),
  wrongAttempts: int("wrongAttempts").notNull().default(0),
  hintUsed: boolean("hintUsed").notNull().default(false),
  durationSeconds: int("durationSeconds").notNull().default(0),
  executedAt: timestamp("executedAt").defaultNow().notNull(),
});

export type StepExecution = typeof stepExecutions.$inferSelect;
export type InsertStepExecution = typeof stepExecutions.$inferInsert;
