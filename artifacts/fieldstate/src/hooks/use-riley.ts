import { useMemo, useState } from "react";
import type { DialogueStep, RileyRequest, RileyResponse, WorkSpecDraft } from "@workspace/api-zod";

const DEFAULT_DRAFT: WorkSpecDraft = {
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
};

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

function localFallback(input: string, draft: WorkSpecDraft): RileyResponse {
  const lower = input.toLowerCase();
  const nextDraft: WorkSpecDraft = {
    ...draft,
    goal: draft.goal || input,
    problem: draft.problem || input,
    actors: [...draft.actors],
    system_components: [...draft.system_components],
    constraints: [...draft.constraints],
    ambiguities: [...draft.ambiguities],
    decisions: [...draft.decisions],
    qualification_signals: { ...draft.qualification_signals },
  };
  const updatedFields = new Set<string>();

  if (!draft.goal) updatedFields.add("goal");
  if (!draft.problem) updatedFields.add("problem");

  if (/team|admin|customer|user|ops/.test(lower)) {
    if (lower.includes("team") && !nextDraft.actors.includes("Internal team")) nextDraft.actors.push("Internal team");
    if (lower.includes("admin") && !nextDraft.actors.includes("Admins")) nextDraft.actors.push("Admins");
    if ((lower.includes("customer") || lower.includes("user")) && !nextDraft.actors.includes("End users")) nextDraft.actors.push("End users");
    if (lower.includes("ops") && !nextDraft.actors.includes("Operations")) nextDraft.actors.push("Operations");
    updatedFields.add("actors");
  }

  if (/workflow|dashboard|portal|api|tool|system|agent/.test(lower)) {
    const pairs = [
      ["workflow", "Workflow engine"],
      ["dashboard", "Operational dashboard"],
      ["portal", "User portal"],
      ["api", "Integration layer"],
      ["tool", "Internal tool"],
      ["system", "Core system boundary"],
      ["agent", "AI interaction layer"],
    ] as const;
    for (const [term, label] of pairs) {
      if (lower.includes(term) && !nextDraft.system_components.includes(label)) {
        nextDraft.system_components.push(label);
      }
    }
    updatedFields.add("system_components");
  }

  if (/deadline|budget|legacy|migration|trust|compliance/.test(lower)) {
    const pairs = [
      ["deadline", "Delivery timing matters"],
      ["budget", "Budget is constrained"],
      ["legacy", "Must integrate with a legacy system"],
      ["migration", "Migration risk is present"],
      ["trust", "Trust and governance matter"],
      ["compliance", "Regulatory pressure exists"],
    ] as const;
    for (const [term, label] of pairs) {
      if (lower.includes(term) && !nextDraft.constraints.includes(label)) {
        nextDraft.constraints.push(label);
      }
    }
    updatedFields.add("constraints");
  }

  nextDraft.ambiguities = [
    ...new Set(
      [
        ...nextDraft.ambiguities,
        ...(nextDraft.system_components.length === 0 ? ["The core system components are still unnamed."] : []),
        ...(nextDraft.actors.length === 0 ? ["The user and operator roles are still unclear."] : []),
        ...(/ai-powered|revolutionary|innovative|seamless|platform|ecosystem|synergy/.test(lower)
          ? ["The brief is still speaking in abstractions instead of structure."]
          : []),
      ].filter(Boolean),
    ),
  ];
  if (nextDraft.ambiguities.length) updatedFields.add("ambiguities");

  nextDraft.qualification_signals = {
    complexity: nextDraft.system_components.length >= 3 ? "high" : nextDraft.system_components.length > 0 ? "medium" : "low",
    ambiguity: nextDraft.ambiguities.length >= 3 ? "high" : nextDraft.ambiguities.length > 0 ? "medium" : "low",
    stakes: /trust|compliance|deadline|revenue/.test(lower) ? "high" : "medium",
    need_for_structure:
      nextDraft.ambiguities.length + nextDraft.constraints.length >= 4
        ? "high"
        : nextDraft.ambiguities.length > 0
          ? "medium"
          : "low",
  };
  nextDraft.recommended_next_step =
    nextDraft.system_components.length === 0
      ? "Name the system boundary before you ask for delivery."
      : "Constrain the highest-risk ambiguity before delivery starts.";
  updatedFields.add("qualification_signals");
  updatedFields.add("recommended_next_step");

  let reply = "That is still intent, not structure. What actually happens when a user starts?";
  if (/ai-powered|revolutionary|innovative|seamless|platform|ecosystem|synergy/.test(lower)) {
    reply = "This is still abstraction. I don't need category words. I need the first concrete workflow this system has to support.";
  } else if (/just build|move fast|ship fast|asap|right away/.test(lower)) {
    reply = "Speed is not the problem yet. Undefined systems just fail faster. What constraint makes this build hard?";
  } else if (nextDraft.actors.length === 0) {
    reply = "I have the direction. I still don't have the people inside the system. Who uses it first, and who owns it when it breaks?";
  } else if (nextDraft.system_components.length === 0) {
    reply = "The problem is clearer. The system still isn't. Name the moving parts: workflow, interface, approvals, data, integrations.";
  } else {
    reply = "The model moved. I've locked the strongest signals into WorkSpec. Which unresolved ambiguity is already slowing delivery down?";
  }

  return {
    mode:
      nextDraft.goal && nextDraft.problem && nextDraft.system_components.length >= 2
        ? "engage"
        : nextDraft.goal || nextDraft.problem
          ? "define"
          : "explore",
    reply: {
      id: randomId(),
      role: "riley",
      content: reply,
    },
    draft: nextDraft,
    updatedFields: [...updatedFields],
    qualification: nextDraft.qualification_signals,
    recommendedNextStep: nextDraft.recommended_next_step,
    fit: nextDraft.qualification_signals.need_for_structure === "high" ? "qualified" : "unknown",
  };
}

const initialHistory: DialogueStep[] = [
  {
    id: "riley-intro",
    role: "riley",
    content:
      "Code got cheaper. Mistakes didn't. Start with the system, not the sprint.",
  },
];

export function useRiley() {
  const sessionId = useMemo(() => `riley-${randomId()}`, []);
  const [history, setHistory] = useState<DialogueStep[]>(initialHistory);
  const [draft, setDraft] = useState<WorkSpecDraft>(DEFAULT_DRAFT);
  const [updatedFields, setUpdatedFields] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fit, setFit] = useState<RileyResponse["fit"]>("unknown");

  const submit = async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userStep: DialogueStep = {
      id: randomId(),
      role: "user",
      content: trimmed,
    };

    const nextHistory = [...history, userStep];
    setHistory(nextHistory);
    setIsPending(true);
    setError(null);

    const payload: RileyRequest = {
      sessionId,
      input: trimmed,
      history: nextHistory,
      draft,
    };

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
      const res = await fetch(`${baseUrl}/api/riley`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Riley interface unavailable.");
      }

      const response = (await res.json()) as RileyResponse;
      setDraft(response.draft);
      setUpdatedFields(response.updatedFields);
      setFit(response.fit);
      setHistory((current) => [...current, response.reply]);
    } catch (err) {
      const fallback = localFallback(trimmed, draft);
      setDraft(fallback.draft);
      setUpdatedFields(fallback.updatedFields);
      setFit(fallback.fit);
      setHistory((current) => [...current, fallback.reply]);
      setError(err instanceof Error ? err.message : "Riley interface unavailable.");
    } finally {
      setIsPending(false);
    }
  };

  return {
    draft,
    error,
    fit,
    history,
    isPending,
    submit,
    updatedFields,
  };
}
