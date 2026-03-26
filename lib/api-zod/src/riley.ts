import { z } from "zod/v4";

export const RileyModeSchema = z.enum(["explore", "define", "engage"]);
export type RileyMode = z.infer<typeof RileyModeSchema>;

export const SignalLevelSchema = z.enum(["low", "medium", "high"]);
export type SignalLevel = z.infer<typeof SignalLevelSchema>;

export const QualificationSignalsSchema = z.object({
  complexity: SignalLevelSchema,
  ambiguity: SignalLevelSchema,
  stakes: SignalLevelSchema,
  need_for_structure: SignalLevelSchema,
});
export type QualificationSignals = z.infer<typeof QualificationSignalsSchema>;

export const WorkSpecDraftSchema = z.object({
  goal: z.string().default(""),
  problem: z.string().default(""),
  actors: z.array(z.string()).default([]),
  system_components: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  ambiguities: z.array(z.string()).default([]),
  decisions: z.array(z.string()).default([]),
  qualification_signals: QualificationSignalsSchema.default({
    complexity: "medium",
    ambiguity: "medium",
    stakes: "medium",
    need_for_structure: "medium",
  }),
  recommended_next_step: z.string().default("Clarify the system boundary."),
});
export type WorkSpecDraft = z.infer<typeof WorkSpecDraftSchema>;

export const DialogueRoleSchema = z.enum(["user", "riley"]);
export type DialogueRole = z.infer<typeof DialogueRoleSchema>;

export const DialogueStepSchema = z.object({
  id: z.string(),
  role: DialogueRoleSchema,
  content: z.string(),
});
export type DialogueStep = z.infer<typeof DialogueStepSchema>;

export const RileyStateSchema = z.object({
  sessionId: z.string(),
  mode: RileyModeSchema,
  draft: WorkSpecDraftSchema,
  history: z.array(DialogueStepSchema),
});
export type RileyState = z.infer<typeof RileyStateSchema>;

export const RileyRequestSchema = z.object({
  sessionId: z.string().min(1),
  input: z.string().min(1),
  history: z.array(DialogueStepSchema).default([]),
  draft: WorkSpecDraftSchema.default({
    goal: "",
    problem: "",
    actors: [],
    system_components: [],
    constraints: [],
    ambiguities: [],
    decisions: [],
    qualification_signals: {
      complexity: "medium",
      ambiguity: "medium",
      stakes: "medium",
      need_for_structure: "medium",
    },
    recommended_next_step: "Clarify the system boundary.",
  }),
});
export type RileyRequest = z.infer<typeof RileyRequestSchema>;

export const RileyResponseSchema = z.object({
  mode: RileyModeSchema,
  reply: DialogueStepSchema,
  draft: WorkSpecDraftSchema,
  updatedFields: z.array(z.string()).default([]),
  qualification: QualificationSignalsSchema,
  recommendedNextStep: z.string(),
  fit: z.enum(["unknown", "qualified", "not-a-fit"]).default("unknown"),
});
export type RileyResponse = z.infer<typeof RileyResponseSchema>;
