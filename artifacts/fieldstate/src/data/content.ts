export const navigation = [
  { label: "Home", path: "/" },
  { label: "WorkSpec", path: "/workspec" },
  { label: "Systems", path: "/systems" },
  { label: "Proof", path: "/proof" },
];

export const homeProof = [
  {
    system: "Raw product idea",
    intervention: "Riley pushes vague intent into explicit actors, constraints, and flows.",
    result: "The team gets a usable system definition before code starts.",
  },
  {
    system: "LLM-heavy delivery workflow",
    intervention: "WorkSpec constrains what the model is allowed to generate.",
    result: "Output becomes reliable instead of merely fast.",
  },
  {
    system: "Fragmented planning",
    intervention: "Fieldstate imposes traceability across decisions and dependencies.",
    result: "Delivery stops drifting because the architecture is legible.",
  },
];

export const workspecCapabilities = [
  "System mapping from dialogue, not static forms.",
  "Spec generation that keeps context beside implementation.",
  "Traceable decisions that survive beyond the first sprint.",
  "Constraints that direct AI instead of letting it hallucinate structure.",
];

export const systemLayers = [
  {
    name: "Synthesis",
    line: "Where WorkSpec defines structure, Synthesis connects meaning.",
    description:
      "Synthesis is the decision-intelligence layer. It finds patterns across systems, clarifies what belongs together, and keeps structured thinking connected instead of fragmented.",
  },
  {
    name: "Hearth",
    line: "Systems need somewhere to land. Hearth is that layer.",
    description:
      "Hearth is the human interaction layer. It is where architecture meets trust, workflow, and the lived experience of the people operating the system.",
  },
  {
    name: "Financial Layer",
    line: "Structured thinking does not stop at product boundaries.",
    description:
      "This layer extends system definition into money, relationships, and long-term operational logic. The point is not finance tooling. The point is coherent structure across the whole field.",
  },
];

export const proofCases = [
  {
    system: "Undefined product concept",
    intervention:
      "Riley forced the team to name actors, constraints, and failure points before a roadmap existed.",
    result:
      "Ambiguity dropped fast enough for the team to move from hype to executable system definition.",
    emphasis: "ambiguity clarified",
  },
  {
    system: "LLM-assisted feature delivery",
    intervention:
      "WorkSpec constrained the model with explicit decisions, guardrails, and system components.",
    result:
      "Generated output became usable because the architecture existed before the prompts scaled.",
    emphasis: "constraints imposed",
  },
  {
    system: "Cross-functional planning drift",
    intervention:
      "Fieldstate introduced traceable decisions and a shared structural model instead of scattered documents.",
    result:
      "Design, engineering, and stakeholders operated against the same system map.",
    emphasis: "traceability created",
  },
];
