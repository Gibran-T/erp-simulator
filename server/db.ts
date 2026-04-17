import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  cohorts, InsertCohort,
  erpStudents, InsertErpStudent,
  erpTeachers, InsertErpTeacher,
  scenarioScores, InsertScenarioScore,
  quizScores, InsertQuizScore,
  scenarioAttempts,
  reflectionAnswers,
  stepExecutions,
  inviteTokens, InsertInviteToken,
  passwordResetTokens,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Cohorts ──────────────────────────────────────────────────────────────
export async function getAllCohorts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cohorts).orderBy(desc(cohorts.createdAt));
}

export async function createCohort(data: Omit<InsertCohort, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(cohorts).values(data);
}

export async function updateCohortById(id: number, data: Partial<InsertCohort>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(cohorts).set(data).where(eq(cohorts.id, id));
}

export async function deleteCohortById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(cohorts).where(eq(cohorts.id, id));
}

// ─── ERP Students ─────────────────────────────────────────────────────────
export async function getAllStudents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(erpStudents).orderBy(desc(erpStudents.createdAt));
}

export async function getStudentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(erpStudents).where(eq(erpStudents.id, id)).limit(1);
  return result[0];
}

export async function getStudentByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(erpStudents).where(eq(erpStudents.email, email)).limit(1);
  return result[0];
}

export async function createStudent(data: Omit<InsertErpStudent, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(erpStudents).values(data);
}

export async function updateStudentById(id: number, data: Partial<InsertErpStudent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(erpStudents).set({ ...data, updatedAt: new Date() }).where(eq(erpStudents.id, id));
}

export async function deleteStudentById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(erpStudents).where(eq(erpStudents.id, id));
}

// ─── ERP Teachers ─────────────────────────────────────────────────────────
export async function getAllTeachers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(erpTeachers).orderBy(desc(erpTeachers.createdAt));
}

export async function getTeacherByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(erpTeachers).where(eq(erpTeachers.email, email)).limit(1);
  return result[0];
}

export async function createTeacher(data: Omit<InsertErpTeacher, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(erpTeachers).values(data);
}

export async function updateTeacherById(id: number, data: Partial<InsertErpTeacher>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(erpTeachers).set({ ...data, updatedAt: new Date() }).where(eq(erpTeachers.id, id));
}

// ─── Scenario Scores ──────────────────────────────────────────────────────
export async function saveScenarioScore(data: Omit<InsertScenarioScore, 'id' | 'completedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(scenarioScores).values(data);
}

export async function getScenarioScoresByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scenarioScores)
    .where(eq(scenarioScores.studentId, studentId))
    .orderBy(desc(scenarioScores.completedAt));
}

export async function getAllScenarioScores() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scenarioScores).orderBy(desc(scenarioScores.completedAt));
}

// ─── Quiz Scores ──────────────────────────────────────────────────────────
export async function saveQuizScore(data: Omit<InsertQuizScore, 'id' | 'completedAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(quizScores).values(data);
}

export async function getQuizScoresByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizScores)
    .where(eq(quizScores.studentId, studentId))
    .orderBy(desc(quizScores.completedAt));
}

export async function getAllQuizScores() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizScores).orderBy(desc(quizScores.completedAt));
}

// ─── Scenario Attempts ────────────────────────────────────────
export async function saveScenarioAttempt(data: {
  studentId: number;
  scenarioId: string;
  moduleId: string;
  score: number;
  hintsUsed: number;
  wrongAttempts: number;
  examMode: boolean;
  durationSeconds: number;
  stepBreakdown?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(scenarioAttempts).values(data);
}

export async function getAttemptsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scenarioAttempts)
    .where(eq(scenarioAttempts.studentId, studentId))
    .orderBy(desc(scenarioAttempts.completedAt));
}

export async function getAttemptsByScenario(scenarioId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scenarioAttempts)
    .where(eq(scenarioAttempts.scenarioId, scenarioId))
    .orderBy(desc(scenarioAttempts.completedAt));
}

export async function getAllAttempts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(scenarioAttempts).orderBy(desc(scenarioAttempts.completedAt));
}

// --- Reflection Answers ---
export async function saveReflectionAnswer(data: {
  studentId: number;
  scenarioId: string;
  questionId: string;
  answer: string;
  lang: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(reflectionAnswers).values(data);
}

export async function getReflectionAnswersByScenario(scenarioId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reflectionAnswers)
    .where(eq(reflectionAnswers.scenarioId, scenarioId))
    .orderBy(desc(reflectionAnswers.submittedAt));
}

export async function getReflectionAnswersByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reflectionAnswers)
    .where(eq(reflectionAnswers.studentId, studentId))
    .orderBy(desc(reflectionAnswers.submittedAt));
}

export async function getAllReflectionAnswers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reflectionAnswers)
    .orderBy(desc(reflectionAnswers.submittedAt));
}

// --- Step Executions ---
export async function saveStepExecutions(data: Array<{
  attemptId: number;
  studentId: number;
  scenarioId: string;
  stepId: string;
  stepNumber: number;
  result: 'ok' | 'error' | 'hint';
  wrongAttempts: number;
  hintUsed: boolean;
  durationSeconds: number;
}>): Promise<void> {
  const db = await getDb();
  if (!db || data.length === 0) return;
  await db.insert(stepExecutions).values(data);
}

export async function getStepExecutionsByAttempt(attemptId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stepExecutions)
    .where(eq(stepExecutions.attemptId, attemptId))
    .orderBy(stepExecutions.stepNumber);
}

export async function getStepExecutionsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stepExecutions)
    .where(eq(stepExecutions.studentId, studentId))
    .orderBy(desc(stepExecutions.executedAt));
}

export async function getLastAttemptId(studentId: number, scenarioId: string): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select({ id: scenarioAttempts.id })
    .from(scenarioAttempts)
    .where(eq(scenarioAttempts.studentId, studentId))
    .orderBy(desc(scenarioAttempts.completedAt))
    .limit(1);
  return rows[0]?.id ?? null;
}

// ─── Invite Tokens ────────────────────────────────────────────────────────
export async function createInviteToken(data: Omit<InsertInviteToken, 'id' | 'createdAt'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(inviteTokens).values(data);
}

export async function getInviteToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inviteTokens).where(eq(inviteTokens.token, token)).limit(1);
  return result[0];
}

export async function markInviteTokenUsed(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(inviteTokens).set({ usedAt: new Date() }).where(eq(inviteTokens.token, token));
}

// ─── Password Reset Tokens ────────────────────────────────────────────────
export async function createPasswordResetToken(data: { token: string; email: string; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(passwordResetTokens).values(data);
}

export async function getPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
  return result[0];
}

export async function markPasswordResetTokenUsed(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.token, token));
}
