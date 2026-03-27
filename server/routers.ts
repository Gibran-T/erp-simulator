import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import {
  getAllCohorts, createCohort, updateCohortById, deleteCohortById,
  getAllStudents, getStudentById, getStudentByEmail, createStudent, updateStudentById, deleteStudentById,
  getAllTeachers, getTeacherByEmail, createTeacher, updateTeacherById,
  saveScenarioScore, getScenarioScoresByStudent, getAllScenarioScores,
  saveQuizScore, getQuizScoresByStudent, getAllQuizScores,
} from "./db";

const ERP_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "erp-simulator-secret-2026"
);
const ERP_COOKIE = "erp_session";

async function signErpToken(payload: { id: number; email: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(ERP_JWT_SECRET);
}

async function verifyErpToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ERP_JWT_SECRET);
    return payload as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}

async function requireTeacher(ctx: { req: { cookies?: Record<string, string> } }) {
  const token = ctx.req.cookies?.[ERP_COOKIE];
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });
  const payload = await verifyErpToken(token);
  if (!payload || (payload.role !== "teacher" && payload.role !== "admin")) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acces reserve aux professeurs." });
  }
  return payload;
}

const erpAuthRouter = router({
  studentLogin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const student = await getStudentByEmail(input.email.toLowerCase());
      if (!student || student.status === "inactive") {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
      }
      const valid = await bcrypt.compare(input.password, student.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
      await updateStudentById(student.id, { lastActive: new Date() });
      const token = await signErpToken({ id: student.id, email: student.email, role: "student" });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(ERP_COOKIE, token, { ...cookieOpts, maxAge: 12 * 60 * 60 * 1000 });
      return { id: student.id, name: student.name, email: student.email, role: "student" as const, cohortId: student.cohortId };
    }),

  teacherLogin: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const teacher = await getTeacherByEmail(input.email.toLowerCase());
      if (!teacher) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
      const valid = await bcrypt.compare(input.password, teacher.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou mot de passe incorrect." });
      await updateTeacherById(teacher.id, { lastActive: new Date() });
      const token = await signErpToken({ id: teacher.id, email: teacher.email, role: teacher.role });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(ERP_COOKIE, token, { ...cookieOpts, maxAge: 12 * 60 * 60 * 1000 });
      return { id: teacher.id, name: teacher.name, email: teacher.email, role: teacher.role as "teacher" | "admin" };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[ERP_COOKIE];
    if (!token) return null;
    const payload = await verifyErpToken(token);
    if (!payload) return null;
    if (payload.role === "student") {
      const student = await getStudentById(payload.id);
      if (!student) return null;
      return { id: student.id, name: student.name, email: student.email, role: "student" as const, cohortId: student.cohortId };
    } else {
      const teacher = await getTeacherByEmail(payload.email);
      if (!teacher) return null;
      return { id: teacher.id, name: teacher.name, email: teacher.email, role: teacher.role as "teacher" | "admin" };
    }
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOpts = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(ERP_COOKIE, { ...cookieOpts, maxAge: -1 });
    return { success: true };
  }),

  changePassword: publicProcedure
    .input(z.object({ currentPassword: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ input, ctx }) => {
      const token = ctx.req.cookies?.[ERP_COOKIE];
      if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });
      const payload = await verifyErpToken(token);
      if (!payload) throw new TRPCError({ code: "UNAUTHORIZED" });
      if (payload.role === "student") {
        const student = await getStudentById(payload.id);
        if (!student) throw new TRPCError({ code: "NOT_FOUND" });
        const valid = await bcrypt.compare(input.currentPassword, student.passwordHash);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Mot de passe actuel incorrect." });
        const hash = await bcrypt.hash(input.newPassword, 10);
        await updateStudentById(student.id, { passwordHash: hash });
      } else {
        const teacher = await getTeacherByEmail(payload.email);
        if (!teacher) throw new TRPCError({ code: "NOT_FOUND" });
        const valid = await bcrypt.compare(input.currentPassword, teacher.passwordHash);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Mot de passe actuel incorrect." });
        const hash = await bcrypt.hash(input.newPassword, 10);
        await updateTeacherById(teacher.id, { passwordHash: hash });
      }
      return { success: true };
    }),
});

const cohortsRouter = router({
  list: publicProcedure.query(() => getAllCohorts()),
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), description: z.string().optional(), program: z.string().optional(), semester: z.string().optional(), year: z.number().optional(), status: z.enum(["active", "completed", "planned"]).optional() }))
    .mutation(async ({ input, ctx }) => { await requireTeacher(ctx); await createCohort(input); return { success: true }; }),
  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional(), program: z.string().optional(), semester: z.string().optional(), year: z.number().optional(), status: z.enum(["active", "completed", "planned"]).optional() }))
    .mutation(async ({ input, ctx }) => { await requireTeacher(ctx); const { id, ...data } = input; await updateCohortById(id, data); return { success: true }; }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => { await requireTeacher(ctx); await deleteCohortById(input.id); return { success: true }; }),
});

const studentsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    await requireTeacher(ctx);
    const students = await getAllStudents();
    return students.map(({ passwordHash: _, ...s }) => s);
  }),
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6), cohortId: z.number().optional(), notes: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      await requireTeacher(ctx);
      const existing = await getStudentByEmail(input.email.toLowerCase());
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Un etudiant avec cet email existe deja." });
      const passwordHash = await bcrypt.hash(input.password, 10);
      await createStudent({ name: input.name, email: input.email.toLowerCase(), passwordHash, cohortId: input.cohortId ?? null, notes: input.notes ?? null, status: "active", lastActive: null });
      return { success: true };
    }),
  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string().optional(), email: z.string().email().optional(), cohortId: z.number().nullable().optional(), status: z.enum(["active", "inactive"]).optional(), notes: z.string().optional() }))
    .mutation(async ({ input, ctx }) => { await requireTeacher(ctx); const { id, ...data } = input; await updateStudentById(id, data); return { success: true }; }),
  resetPassword: publicProcedure
    .input(z.object({ id: z.number(), newPassword: z.string().min(6) }))
    .mutation(async ({ input, ctx }) => { await requireTeacher(ctx); const passwordHash = await bcrypt.hash(input.newPassword, 10); await updateStudentById(input.id, { passwordHash }); return { success: true }; }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => { await requireTeacher(ctx); await deleteStudentById(input.id); return { success: true }; }),
  importBulk: publicProcedure
    .input(z.array(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6), cohortId: z.number().optional() })))
    .mutation(async ({ input, ctx }) => {
      await requireTeacher(ctx);
      let created = 0; let skipped = 0;
      for (const s of input) {
        const existing = await getStudentByEmail(s.email.toLowerCase());
        if (existing) { skipped++; continue; }
        const passwordHash = await bcrypt.hash(s.password, 10);
        await createStudent({ name: s.name, email: s.email.toLowerCase(), passwordHash, cohortId: s.cohortId ?? null, notes: null, status: "active", lastActive: null });
        created++;
      }
      return { created, skipped };
    }),
});

const scoresRouter = router({
  submitScenario: publicProcedure
    .input(z.object({ scenarioId: z.string(), moduleId: z.string(), score: z.number().min(0).max(100), hintsUsed: z.number().default(0), wrongAttempts: z.number().default(0), examMode: z.boolean().default(false) }))
    .mutation(async ({ input, ctx }) => {
      const token = ctx.req.cookies?.[ERP_COOKIE];
      if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });
      const payload = await verifyErpToken(token);
      if (!payload || payload.role !== "student") throw new TRPCError({ code: "FORBIDDEN" });
      await saveScenarioScore({ studentId: payload.id, scenarioId: input.scenarioId, moduleId: input.moduleId, score: input.score, maxScore: 100, hintsUsed: input.hintsUsed, wrongAttempts: input.wrongAttempts, examMode: input.examMode });
      await updateStudentById(payload.id, { lastActive: new Date() });
      return { success: true };
    }),
  submitQuiz: publicProcedure
    .input(z.object({ moduleId: z.string(), score: z.number().min(0).max(100), totalQuestions: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const token = ctx.req.cookies?.[ERP_COOKIE];
      if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });
      const payload = await verifyErpToken(token);
      if (!payload || payload.role !== "student") throw new TRPCError({ code: "FORBIDDEN" });
      await saveQuizScore({ studentId: payload.id, moduleId: input.moduleId, score: input.score, totalQuestions: input.totalQuestions });
      return { success: true };
    }),
  allScenarioScores: publicProcedure.query(async ({ ctx }) => { await requireTeacher(ctx); return getAllScenarioScores(); }),
  allQuizScores: publicProcedure.query(async ({ ctx }) => { await requireTeacher(ctx); return getAllQuizScores(); }),
  myScenarioScores: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[ERP_COOKIE];
    if (!token) return [];
    const payload = await verifyErpToken(token);
    if (!payload) return [];
    return getScenarioScoresByStudent(payload.id);
  }),
  myQuizScores: publicProcedure.query(async ({ ctx }) => {
    const token = ctx.req.cookies?.[ERP_COOKIE];
    if (!token) return [];
    const payload = await verifyErpToken(token);
    if (!payload) return [];
    return getQuizScoresByStudent(payload.id);
  }),
});

const seedRouter = router({
  initDefaultTeacher: publicProcedure
    .input(z.object({ secretKey: z.string() }))
    .mutation(async ({ input }) => {
      if (input.secretKey !== "laconcorde2026") throw new TRPCError({ code: "FORBIDDEN" });
      const existing = await getTeacherByEmail("prof@laconcorde.ca");
      if (existing) return { message: "Teacher already exists" };
      const passwordHash = await bcrypt.hash("prof123", 10);
      await createTeacher({ name: "Prof. Marie Dupont", email: "prof@laconcorde.ca", passwordHash, role: "admin", lastActive: null });
      const studentExists = await getStudentByEmail("student@laconcorde.ca");
      if (!studentExists) {
        const studentHash = await bcrypt.hash("student123", 10);
        await createStudent({ name: "Alexandre Tremblay", email: "student@laconcorde.ca", passwordHash: studentHash, cohortId: null, notes: "Compte de demonstration", status: "active", lastActive: null });
      }
      return { message: "Default accounts created" };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  erp: erpAuthRouter,
  cohorts: cohortsRouter,
  students: studentsRouter,
  scores: scoresRouter,
  seed: seedRouter,
});

export type AppRouter = typeof appRouter;
