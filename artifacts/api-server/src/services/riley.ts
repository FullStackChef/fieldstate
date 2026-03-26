import { randomUUID } from "node:crypto";
import OpenAI from "openai";
import {
  RileyRequestSchema,
  RileyResponseSchema,
  type QualificationSignals,
  type RileyMode,
  type RileyRequest,
  type RileyResponse,
  type WorkSpecDraft,
} from "@workspace/api-zod";

const modelName = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const systemPrompt = `You are Riley, the Fieldstate interface layer.
You are not a chatbot, coach, concierge, or support agent.
Your job is to turn ambiguous product talk into system structure.

Voice:
- direct
- precise
- slightly confrontational
- calm under pressure
- never flattering
- never chirpy
- never generic

Behavior rules:
- Ask one question at a time unless a second is strictly required.
- Never praise vague input.
- Never mirror feelings unless they affect constraints or stakes.
- Always do one of two things: reduce ambiguity, or increase pressure on unresolved ambiguity.
- Always identify what changed in the model after meaningful input.
- Explicitly name when the user is speaking in abstractions instead of structure.
- Prefer forceful language over bureaucratic phrasing.
- Treat buzzwords, vanity language, and "just build it" framing as structural problems.
- If the prompt is weak, redirect sharply or imply lack of fit.

Internal modes:
- explore: clarify fuzzy intent
- define: extract system structure
- engage: determine fit and next step

Output valid JSON only using this shape:
{
  "mode": "explore|define|engage",
  "reply": "string",
  "draft": {
    "goal": "string",
    "problem": "string",
    "actors": ["string"],
    "system_components": ["string"],
    "constraints": ["string"],
    "ambiguities": ["string"],
    "decisions": ["string"],
    "qualification_signals": {
      "complexity": "low|medium|high",
      "ambiguity": "low|medium|high",
      "stakes": "low|medium|high",
      "need_for_structure": "low|medium|high"
    },
    "recommended_next_step": "string"
  },
  "updatedFields": ["goal|problem|actors|system_components|constraints|ambiguities|decisions|qualification_signals|recommended_next_step"],
  "qualification": {
    "complexity": "low|medium|high",
    "ambiguity": "low|medium|high",
    "stakes": "low|medium|high",
    "need_for_structure": "low|medium|high"
  },
  "recommendedNextStep": "string",
  "fit": "unknown|qualified|not-a-fit"
}

Keep arrays concise. Preserve and refine the draft instead of resetting it.`;

function unique(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function textHasAny(input: string, terms: string[]): boolean {
  const lower = input.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function signalLevel(score: number): "low" | "medium" | "high" {
  if (score >= 3) return "high";
  if (score <= 1) return "low";
  return "medium";
}

function inferMode(input: string, draft: WorkSpecDraft): RileyMode {
  if (draft.goal && draft.problem && draft.system_components.length >= 2) {
    return "engage";
  }
  if (draft.goal || draft.problem || draft.actors.length > 0) {
    return "define";
  }
  if (textHasAny(input, ["budget", "timeline", "stakeholder", "scope", "user", "workflow"])) {
    return "define";
  }
  return "explore";
}

function mergeDraft(current: WorkSpecDraft, next: Partial<WorkSpecDraft>): WorkSpecDraft {
  return {
    ...current,
    ...next,
    actors: unique(next.actors ?? current.actors),
    system_components: unique(next.system_components ?? current.system_components),
    constraints: unique(next.constraints ?? current.constraints),
    ambiguities: unique(next.ambiguities ?? current.ambiguities),
    decisions: unique(next.decisions ?? current.decisions),
    qualification_signals: next.qualification_signals ?? current.qualification_signals,
    recommended_next_step: next.recommended_next_step ?? current.recommended_next_step,
  };
}

function fallbackEngine(req: RileyRequest): RileyResponse {
  const input = req.input.trim();
  const lower = input.toLowerCase();
  const mode = inferMode(input, req.draft);
  const nextDraft: Partial<WorkSpecDraft> = {};
  const updatedFields = new Set<string>();
  const ambiguities = [...req.draft.ambiguities];
  const constraints = [...req.draft.constraints];
  const actors = [...req.draft.actors];
  const systemComponents = [...req.draft.system_components];
  const decisions = [...req.draft.decisions];

  if (!req.draft.goal) {
    nextDraft.goal = input.length > 140 ? `${input.slice(0, 137)}...` : input;
    updatedFields.add("goal");
  }

  if (!req.draft.problem) {
    nextDraft.problem = input;
    updatedFields.add("problem");
  }

  if (textHasAny(lower, ["team", "admin", "customer", "ops", "sales", "support", "founder", "user"])) {
    if (lower.includes("team")) actors.push("Internal team");
    if (lower.includes("admin")) actors.push("Admins");
    if (lower.includes("customer") || lower.includes("user")) actors.push("End users");
    if (lower.includes("ops")) actors.push("Operations");
    updatedFields.add("actors");
  }

  if (textHasAny(lower, ["dashboard", "workflow", "api", "portal", "system", "tool", "platform", "agent"])) {
    if (lower.includes("dashboard")) systemComponents.push("Operational dashboard");
    if (lower.includes("workflow")) systemComponents.push("Workflow engine");
    if (lower.includes("api")) systemComponents.push("Integration layer");
    if (lower.includes("portal")) systemComponents.push("User portal");
    if (lower.includes("tool")) systemComponents.push("Internal tool");
    if (lower.includes("platform")) systemComponents.push("Core platform");
    if (lower.includes("agent")) systemComponents.push("AI interaction layer");
    updatedFields.add("system_components");
  }

  if (textHasAny(lower, ["deadline", "compliance", "budget", "existing", "legacy", "migration", "regulated", "trust"])) {
    if (lower.includes("deadline")) constraints.push("Delivery timing matters");
    if (lower.includes("budget")) constraints.push("Budget is constrained");
    if (textHasAny(lower, ["existing", "legacy", "migration"])) {
      constraints.push("Must work with an existing system");
    }
    if (textHasAny(lower, ["compliance", "regulated", "trust"])) {
      constraints.push("Trust and governance matter");
    }
    updatedFields.add("constraints");
  }

  const abstractionHeavy = textHasAny(lower, [
    "ai-powered",
    "revolutionary",
    "innovative",
    "seamless",
    "platform",
    "ecosystem",
    "synergy",
    "mvp",
    "scale",
    "growth",
  ]);
  const justBuildIt = textHasAny(lower, ["just build", "move fast", "ship fast", "asap", "right away"]);

  if (abstractionHeavy) {
    ambiguities.push("The brief is still speaking in categories instead of system behavior.");
    updatedFields.add("ambiguities");
  }
  if (justBuildIt) {
    ambiguities.push("Speed is being used to skip definition.");
    updatedFields.add("ambiguities");
  }
  if (systemComponents.length === 0) {
    ambiguities.push("The core system components are still unnamed.");
    updatedFields.add("ambiguities");
  }
  if (actors.length === 0) {
    ambiguities.push("The user and operator roles are still unclear.");
    updatedFields.add("ambiguities");
  }

  nextDraft.actors = actors;
  nextDraft.system_components = systemComponents;
  nextDraft.constraints = constraints;
  nextDraft.ambiguities = ambiguities;
  nextDraft.decisions = decisions;

  const qualification: QualificationSignals = {
    complexity: signalLevel(systemComponents.length + (constraints.length > 0 ? 1 : 0)),
    ambiguity: signalLevel(ambiguities.length),
    stakes: signalLevel(textHasAny(lower, ["trust", "compliance", "deadline", "legacy", "customer", "revenue"]) ? 3 : 1),
    need_for_structure: signalLevel(ambiguities.length + constraints.length),
  };

  nextDraft.qualification_signals = qualification;
  updatedFields.add("qualification_signals");

  let recommendedNextStep = "Name the system boundary before you ask for delivery.";
  let fit: RileyResponse["fit"] = "unknown";
  let reply = "You're describing motion, not structure. What actually happens when a user starts?";

  if (abstractionHeavy) {
    reply = "This is still abstraction. I don't need category words. I need the first concrete workflow this system has to support.";
  } else if (justBuildIt) {
    reply = "Speed is not the problem yet. Undefined systems just fail faster. What constraint makes this build hard?";
  } else if (!req.draft.problem) {
    reply = "That's direction, not definition. I have the goal now. What is breaking, unclear, or costly in the current system?";
  } else if (actors.length === 0) {
    reply = "I have the problem, but not the people inside it. Who uses this system first, and who owns it when it breaks?";
  } else if (systemComponents.length === 0) {
    reply = "The problem is clearer. The system still isn't. What are the actual moving parts: workflow, interface, data, approvals, integrations?";
  } else if (ambiguities.length > 1) {
    reply = "The model moved, but the risk is still in the gaps. I've flagged the unresolved ambiguities. Which one is already slowing delivery down?";
  } else {
    recommendedNextStep = "Fieldstate can engage once the remaining ambiguity is constrained.";
    fit = qualification.need_for_structure === "high" || qualification.stakes === "high" ? "qualified" : "unknown";
    reply = "This is starting to behave like a system. I've locked the core structure and the pressure points. What constraint matters most if this goes wrong?";
  }

  nextDraft.recommended_next_step = recommendedNextStep;
  updatedFields.add("recommended_next_step");

  const draft = mergeDraft(req.draft, nextDraft);

  return RileyResponseSchema.parse({
    mode,
    reply: {
      id: randomUUID(),
      role: "riley",
      content: reply,
    },
    draft,
    updatedFields: Array.from(updatedFields),
    qualification,
    recommendedNextStep: draft.recommended_next_step,
    fit,
  });
}

function normalizeModelResponse(raw: unknown, req: RileyRequest): RileyResponse {
  const source = raw as Record<string, unknown>;
  const parsed = RileyResponseSchema.parse({
    ...source,
    reply: {
      id: randomUUID(),
      role: "riley",
      content:
        typeof source.reply === "string"
          ? source.reply
          : "The structure moved, but the next constraint is still unclear.",
    },
  });

  const mergedDraft = mergeDraft(req.draft, parsed.draft);
  return {
    ...parsed,
    draft: mergedDraft,
    qualification: mergedDraft.qualification_signals,
    recommendedNextStep: mergedDraft.recommended_next_step,
  };
}

export async function runRiley(request: unknown): Promise<RileyResponse> {
  const parsed = RileyRequestSchema.parse(request);

  if (!openai) {
    return fallbackEngine(parsed);
  }

  try {
    const prompt = JSON.stringify({
      input: parsed.input,
      history: parsed.history,
      draft: parsed.draft,
    });

    const completion = await openai.chat.completions.create({
      model: modelName,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return fallbackEngine(parsed);
    }

    return normalizeModelResponse(JSON.parse(content), parsed);
  } catch (error) {
    console.error("Riley orchestration fallback:", error);
    return fallbackEngine(parsed);
  }
}
