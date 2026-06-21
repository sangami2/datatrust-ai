import { dataProducts, incidents } from "./mock-data";

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    datasets?: string[];
    score?: number;
    status?: string;
    links?: { label: string; href: string }[];
  };
}

interface ResponseTemplate {
  answer: string;
  evidence?: string;
  blockers?: string[];
  nextAction?: string;
  links?: { label: string; href: string }[];
  datasets?: string[];
  score?: number;
}

function matchKeywords(query: string, keywords: string[]): boolean {
  const lower = query.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function formatScore(score: number, name: string): string {
  return `**${name}** — AI Readiness Score: **${score}/100** (${getLabel(score)})`;
}

function getLabel(score: number): string {
  if (score >= 90) return "AI Ready";
  if (score >= 75) return "Conditionally Ready";
  if (score >= 60) return "Needs Remediation";
  return "High Risk";
}

export function generateResponse(query: string): ResponseTemplate {
  const lower = query.toLowerCase();

  // Churn prediction
  if (matchKeywords(lower, ["churn", "churn prediction", "member churn"])) {
    const p = dataProducts.find((d) => d.id === "member-360")!;
    return {
      answer: `**Member 360** is the recommended dataset for member churn prediction. It provides rich purchase history, engagement signals, and membership attributes with an 18-month historical backtest window.\n\n${formatScore(p.aiReadinessScore, p.name)}\n\nThe dataset is **Conditionally Ready** for churn modeling. Batch churn scoring can proceed, but you should be aware of two active quality issues.`,
      evidence: `• member_id completeness: 100%\n• purchase history coverage: 100%\n• churn label precision: 91%\n• 18-month historical backfill available\n• Feature store coverage: 82%`,
      blockers: [
        "Consent metadata missing for 8% of members — excludes them from retention outreach",
        "Digital engagement signals update daily, not hourly — reduces freshness for intraday churn scoring",
      ],
      nextAction: "Start churn model development using Member 360. Exclude members with missing consent from personalized outreach until backfill completes (estimated: 2 weeks). Monitor the freshness SLA incident.",
      links: [
        { label: "View Member 360", href: "/catalog/member-360" },
        { label: "See Consent Incident", href: "/incidents" },
      ],
      datasets: ["Member 360"],
      score: p.aiReadinessScore,
    };
  }

  // Retail media not ready
  if (matchKeywords(lower, ["retail media", "campaign performance", "why is retail", "not ai-ready", "not ready"])) {
    const p = dataProducts.find((d) => d.id === "retail-media-campaign")!;
    return {
      answer: `**Retail Media Campaign Performance** has an AI Readiness Score of **${p.aiReadinessScore}/100**, placing it in the **Needs Remediation** tier. It is the lowest-scoring dataset among the six data products.\n\nThe primary blockers are documentation gaps, attribution window inconsistency, and cross-channel taxonomy mismatches — all of which undermine trust in campaign measurement results.`,
      evidence: `• Documentation score: 48/100 (lowest dimension)\n• Accuracy / Validity: 63/100 — attribution inflated by organic conversions\n• Schema Stability: 68/100 — breaking change in May 2026\n• Audience segment coverage: 85%\n• Cross-channel match error rate: ~12%`,
      blockers: [
        "Campaign taxonomy inconsistent across digital vs. in-store channels",
        "Attribution window (7/14/30 day) methodology is undocumented",
        "Cross-channel audience matching has 12% error rate",
        "Attribution accuracy for 30-day window is only 71%",
      ],
      nextAction: "Prioritize: (1) Document attribution window methodology, (2) Create cross-channel taxonomy mapping, (3) Standardize to 14-day attribution as default. These three steps would increase the AI Readiness Score by an estimated 10-15 points.",
      links: [
        { label: "View Retail Media Dataset", href: "/catalog/retail-media-campaign" },
        { label: "View Open Incidents", href: "/incidents" },
        { label: "Prioritization Dashboard", href: "/prioritization" },
      ],
      datasets: ["Retail Media Campaign Performance"],
      score: p.aiReadinessScore,
    };
  }

  // Real-time personalization
  if (matchKeywords(lower, ["real-time", "realtime", "real time personalization", "personalization"])) {
    const member360 = dataProducts.find((d) => d.id === "member-360")!;
    const fit = member360.useCaseFits.find((f) => f.useCase === "Real-time Personalization");
    return {
      answer: `Real-time personalization is **not currently supported** by any of the six data products. **Member 360** is the closest candidate but has a fit score of only **${fit?.fitScore ?? 41}/100** for this use case — rated **Not Recommended Yet**.\n\nThe core problem is that Member 360 is a batch-refresh dataset (hourly at best) with no real-time feature serving infrastructure.`,
      evidence: `• Member 360 refresh cadence: Hourly incremental (not sub-minute)\n• Feature store: No real-time serving capability\n• Digital engagement fields: Updated daily only\n• Consent coverage: 92% (required for personalization)\n• No streaming pipeline available for member signals`,
      blockers: [
        "No real-time feature serving infrastructure — features are served from batch snapshots",
        "Digital engagement signals lag by up to 24 hours",
        "Consent gaps block personalization for 8% of members",
        "Purchase history lag during peak periods reduces signal freshness",
      ],
      nextAction: "To unlock real-time personalization: (1) Evaluate feature store migration for top 20 member signals, (2) Build near-real-time engagement pipeline (target: < 5 min latency), (3) Complete consent backfill. Estimated readiness: Q4 2026 at earliest with focused investment.",
      links: [
        { label: "View Member 360", href: "/catalog/member-360" },
        { label: "Evaluate Use Case", href: "/use-case-fit" },
      ],
      datasets: ["Member 360"],
      score: fit?.fitScore ?? 41,
    };
  }

  // Fix first / highest priority
  if (matchKeywords(lower, ["fix first", "highest priority", "most impactful", "what should we fix", "prioritize", "next quarter"])) {
    return {
      answer: `Based on the prioritization model — which weighs quality severity, downstream user impact, and number of AI use cases blocked — the **top three improvements** to make are:\n\n**1. Backfill Member 360 consent metadata** (Priority Score: 94)\nUnblocks 3.2M members from personalized offer and retail media programs.\n\n**2. Fix Android Scan & Go session tracking** (Priority Score: 87)\nRestores 18% of Android events and unblocks adoption modeling and experiment analysis.\n\n**3. Standardize Retail Media campaign taxonomy** (Priority Score: 81)\nEnables cross-channel ROAS reporting and advertiser trust.`,
      evidence: `• Member 360 consent gap: 3.2M members affected, 3 AI use cases blocked\n• Android session gap: 43% of Scan & Go users on Android, 3 experiments affected\n• Campaign taxonomy: 4 advertisers reporting inconsistent ROAS`,
      blockers: [],
      nextAction: "View the full prioritization dashboard for effort estimates, roadmap quarters, and owner assignments.",
      links: [
        { label: "Prioritization Dashboard", href: "/prioritization" },
        { label: "View Incidents", href: "/incidents" },
      ],
      datasets: ["Member 360", "Scan & Go Events", "Retail Media Campaign Performance"],
    };
  }

  // Scan & Go funnel / experimentation
  if (matchKeywords(lower, ["scan & go", "scan and go", "scanandgo", "funnel", "experiment"])) {
    const p = dataProducts.find((d) => d.id === "scan-go-events")!;
    return {
      answer: `**Scan & Go Events** is well-suited for funnel analysis and experiment analysis with an AI Readiness Score of **${p.aiReadinessScore}/100**.\n\nFor funnel analysis, the dataset has excellent freshness (15-minute SLA) and high accuracy for iOS users. For experiment analysis, it is **Recommended** with a fit score of **91/100**.\n\nHowever, you must account for the active Android session gap affecting 18% of events.`,
      evidence: `• Freshness SLA: 15 minutes (98% adherence)\n• iOS session_id completeness: 99%\n• Android session_id completeness: 82% (active incident)\n• Payment event accuracy: 99.2%\n• Experiment label coverage: 96%`,
      blockers: [
        "Android session_id missing for 18% of events — biases cross-platform funnel metrics",
        "Offline event replay documentation missing — timestamp handling is undocumented",
      ],
      nextAction: "For experiment analysis: segment by device platform and apply Android correction factor. For funnel analysis: use iOS-only cohort for clean funnel metrics until Android SDK fix ships (target: v4.3.0 in July 2026).",
      links: [
        { label: "View Scan & Go Events", href: "/catalog/scan-go-events" },
        { label: "Android Session Incident", href: "/incidents" },
      ],
      datasets: ["Scan & Go Events"],
      score: p.aiReadinessScore,
    };
  }

  // Which quality issue affects most downstream
  if (matchKeywords(lower, ["most downstream", "most users", "most impact", "biggest impact", "affects the most"])) {
    const topIncident = incidents[0];
    return {
      answer: `The quality issue with the **broadest downstream impact** is the **Member 360 Freshness SLA Breach** (inc-001). This incident affects **38 downstream users** across 4 teams and blocks 3 high-value AI use cases simultaneously.\n\nClose behind is the **Android Scan & Go Session Gap**, which affects 24 users across 4 teams and is directly impacting 8 currently running experiments.`,
      evidence: `• Member 360 SLA breach: 38 affected users, 3 blocked use cases\n• Android session gap: 24 affected users, 8 experiments impacted\n• Retail Media taxonomy: 19 users, 3 blocked use cases\n• Inventory SKU mismatch: 22 users, 2 blocked use cases`,
      blockers: [],
      nextAction: "Resolve the Member 360 SLA breach immediately (ETL lock release) — it has the broadest immediate impact. The Android SDK fix should be the next engineering priority.",
      links: [
        { label: "View All Incidents", href: "/incidents" },
        { label: "Prioritization Dashboard", href: "/prioritization" },
      ],
      datasets: ["Member 360", "Scan & Go Events"],
    };
  }

  // Incidents this week / summary
  if (matchKeywords(lower, ["incidents", "this week", "summarize", "summary", "open incidents"])) {
    const openIncidents = incidents.filter((i) => i.status !== "resolved");
    return {
      answer: `There are currently **${openIncidents.length} open quality incidents** across the data product catalog. Here is a summary by severity:\n\n**Critical (1):** Member 360 Freshness SLA Breach — 5h 42m delay, 38 users affected\n\n**High (3):** Retail Media taxonomy mismatch, Scan & Go Android session gap, Exit Experience CV drift at 2 clubs, Inventory SKU hierarchy mismatch\n\n**Medium (3):** Retail Media attribution documentation, Member 360 consent backfill, Experiment Registry guardrail gaps`,
      evidence: `• Total open incidents: ${openIncidents.length}\n• Critical: 1 | High: 4 | Medium: 3\n• Total downstream users affected: 141\n• AI use cases blocked: 12 distinct use cases`,
      blockers: [],
      nextAction: "View the Incident Center for full details, root-cause hypotheses, and remediation plans.",
      links: [
        { label: "Incident Center", href: "/incidents" },
        { label: "Prioritization Dashboard", href: "/prioritization" },
      ],
      datasets: ["Member 360", "Retail Media Campaign Performance", "Scan & Go Events", "Exit Experience Events", "Inventory Signals", "Experiment Registry"],
    };
  }

  // Inventory
  if (matchKeywords(lower, ["inventory", "stockout", "replenishment", "sku"])) {
    const p = dataProducts.find((d) => d.id === "inventory-signals")!;
    return {
      answer: `**Inventory Signals** has an AI Readiness Score of **${p.aiReadinessScore}/100** — in the **Needs Remediation** tier. It is conditionally suitable for inventory anomaly detection and replenishment forecasting, but has several active blockers.\n\nKey strengths: long historical data, club-level granularity, SKU-level coverage.\nKey weaknesses: poor documentation, unversioned SKU hierarchy changes, and robot scan gaps at legacy device clubs.`,
      evidence: `• Documentation score: 52/100 (second lowest)\n• SKU hierarchy version mismatches: 1,842 SKUs affected\n• Robot scan confidence missing: ~15% of clubs\n• Freshness SLA adherence: 88% (some clubs delayed 8+ hours)\n• Data contract: Not started`,
      blockers: [
        "SKU hierarchy changes unversioned — silent breakage in downstream models",
        "Robot scan confidence missing at legacy device clubs",
        "No formal data contract — no quality guarantees for consumers",
        "Documentation is minimal — high onboarding burden",
      ],
      nextAction: "Before using in production models: (1) Implement SKU hierarchy versioning, (2) Validate feature coverage for target club set, (3) Initiate data contract process.",
      links: [
        { label: "View Inventory Signals", href: "/catalog/inventory-signals" },
        { label: "View Incidents", href: "/incidents" },
      ],
      datasets: ["Inventory Signals"],
      score: p.aiReadinessScore,
    };
  }

  // Experiment registry
  if (matchKeywords(lower, ["experiment registry", "ab test", "a/b test", "experimentation", "guardrail"])) {
    const p = dataProducts.find((d) => d.id === "experiment-registry")!;
    return {
      answer: `**Experiment Registry** is the highest-quality dataset in the catalog with an AI Readiness Score of **${p.aiReadinessScore}/100**. It is the gold standard for experiment analysis and governance with a 91% repeat use rate.\n\nIt is **Recommended** for A/B experiment analysis (fit score: 92/100) and Launch Readiness (89/100). The only active issue is missing guardrail metrics for approximately 8% of active experiments.`,
      evidence: `• Assignment accuracy: 99.8%\n• Schema stable since January 2026\n• Data contract: Signed\n• Active experiments tracked: 143\n• Guardrail metric coverage: 92%\n• Repeat use rate: 91%`,
      blockers: [
        "8% of active experiments missing guardrail metrics — prevents automated governance",
        "11% of feature flags missing ownership metadata",
      ],
      nextAction: "Make guardrail metric definition mandatory in the experiment creation flow. Backfill for the 11 active experiments currently missing them, prioritizing the 3 in pre-launch decision phase.",
      links: [
        { label: "View Experiment Registry", href: "/catalog/experiment-registry" },
        { label: "View Guardrail Incident", href: "/incidents" },
      ],
      datasets: ["Experiment Registry"],
      score: p.aiReadinessScore,
    };
  }

  // Dataset overview / which datasets
  if (matchKeywords(lower, ["which dataset", "all datasets", "catalog", "data products", "list"])) {
    return {
      answer: `The DataTrust AI catalog contains **6 data products** across 5 business domains. Here is the current AI readiness summary:\n\n| Dataset | Score | Status |\n|---------|-------|--------|\n| Experiment Registry | 88 | Conditionally Ready |\n| Scan & Go Events | 86 | Conditionally Ready |\n| Exit Experience Events | 81 | Conditionally Ready |\n| Member 360 | 78 | Conditionally Ready |\n| Inventory Signals | 73 | Needs Remediation |\n| Retail Media Campaign Performance | 69 | Needs Remediation |\n\nAverage AI Readiness Score: **79/100**`,
      evidence: `• AI Ready: 0 datasets\n• Conditionally Ready: 4 datasets\n• Needs Remediation: 2 datasets\n• High Risk: 0 datasets`,
      nextAction: "Explore the full Data Catalog to filter by use case, domain, or readiness level.",
      links: [
        { label: "Data Catalog", href: "/catalog" },
      ],
      datasets: ["Member 360", "Scan & Go Events", "Exit Experience Events", "Inventory Signals", "Retail Media Campaign Performance", "Experiment Registry"],
    };
  }

  // Default / catch-all
  return {
    answer: `I can help you evaluate data products for specific AI use cases, understand quality blockers, or identify remediation priorities.\n\nHere are some things you can ask me:\n• **"Which datasets are ready for churn prediction?"**\n• **"Why is Retail Media Campaign Performance not AI-ready?"**\n• **"What should we fix first to unlock real-time personalization?"**\n• **"Summarize the highest-priority incidents this week."**\n• **"Can I use Scan & Go Events for funnel experimentation?"**`,
    nextAction: "Try one of the suggested prompts below to get started.",
    links: [
      { label: "Data Catalog", href: "/catalog" },
      { label: "AI Use-Case Fit", href: "/use-case-fit" },
      { label: "Incident Center", href: "/incidents" },
    ],
  };
}

export function buildAssistantMessage(query: string): CopilotMessage {
  const response = generateResponse(query);

  let content = response.answer;

  if (response.evidence) {
    content += `\n\n**Supporting Evidence**\n${response.evidence}`;
  }

  if (response.blockers && response.blockers.length > 0) {
    content += `\n\n**Active Blockers**\n${response.blockers.map((b) => `• ${b}`).join("\n")}`;
  }

  if (response.nextAction) {
    content += `\n\n**Recommended Next Action**\n${response.nextAction}`;
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    metadata: {
      datasets: response.datasets,
      score: response.score,
      links: response.links,
    },
  };
}
