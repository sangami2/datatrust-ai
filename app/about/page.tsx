import { ShieldCheck, Target, Users, FileText, TrendingUp, Scale } from "lucide-react";

const scoringDimensions = [
  { name: "Freshness", weight: 15, description: "How current is the data relative to its SLA? Stale data is unreliable for time-sensitive AI use cases." },
  { name: "Completeness", weight: 15, description: "Are critical fields populated at expected rates? Missing values create biased models and incomplete insights." },
  { name: "Accuracy / Validity", weight: 15, description: "Does the data reflect reality and conform to defined schemas? Invalid records corrupt model training." },
  { name: "Schema Stability", weight: 10, description: "How frequently does the schema change, and are changes backward-compatible? Breakage forces downstream rework." },
  { name: "Documentation", weight: 10, description: "Are fields, caveats, and methodologies clearly documented? Poor documentation creates misuse risk." },
  { name: "Ownership", weight: 10, description: "Is there a named owner with defined SLAs and escalation paths? Ownerless data has no accountability." },
  { name: "Privacy / Governance", weight: 10, description: "Is the dataset classified, access-controlled, and compliant with relevant policies? Required for regulated use cases." },
  { name: "Model Readiness", weight: 10, description: "Is the data structured for ML consumption, with feature store coverage and backtest availability?" },
  { name: "Adoption / Reuse", weight: 5, description: "How widely is the dataset used and trusted? Low adoption may signal known quality issues." },
];

const principles = [
  {
    icon: Target,
    title: "Explainable Scoring",
    description: "Every AI Readiness Score is decomposed into dimension-level scores with evidence, business impact assessments, and recommended actions. No black-box ratings.",
  },
  {
    icon: Scale,
    title: "Use-Case-Specific Evaluation",
    description: "Quality dimension weights adjust based on the use case. Real-time personalization cares more about freshness than batch churn prediction does.",
  },
  {
    icon: Users,
    title: "Clear Ownership",
    description: "Every data product has a named owner, team, and escalation path. Ownership is a first-class quality signal, not an afterthought.",
  },
  {
    icon: TrendingUp,
    title: "Actionable Remediation",
    description: "Every quality issue comes with a root-cause hypothesis, remediation steps, and priority ranking based on downstream business impact.",
  },
  {
    icon: FileText,
    title: "Adoption and Business Impact",
    description: "Quality improvements are prioritized based on how many users and AI use cases are affected. High-adoption datasets get higher remediation priority.",
  },
];

const useCaseWeightExamples = [
  {
    useCase: "Real-time Personalization",
    topDimensions: [
      { name: "Freshness", weight: 30 },
      { name: "Completeness", weight: 20 },
      { name: "Model Readiness", weight: 20 },
      { name: "Privacy / Governance", weight: 15 },
    ],
    rationale: "Real-time use cases are unusable without sub-minute freshness and require complete member profiles for every inference.",
  },
  {
    useCase: "Churn Prediction",
    topDimensions: [
      { name: "Completeness", weight: 25 },
      { name: "Accuracy / Validity", weight: 20 },
      { name: "Model Readiness", weight: 20 },
      { name: "Freshness", weight: 15 },
    ],
    rationale: "Churn models are trained on historical data — completeness and accuracy matter more than hourly freshness.",
  },
  {
    useCase: "A/B Experiment Analysis",
    topDimensions: [
      { name: "Accuracy / Validity", weight: 30 },
      { name: "Completeness", weight: 20 },
      { name: "Freshness", weight: 20 },
      { name: "Documentation", weight: 15 },
    ],
    rationale: "Experiment analysis requires accurate assignment data and documented methodology to support valid statistical inference.",
  },
];

export default function AboutPage() {
  return (
    <div className="p-8 max-w-[1000px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">About DataTrust AI</h1>
            <p className="text-sm text-slate-500">Project overview, methodology, and scoring model</p>
          </div>
        </div>
      </div>

      {/* Product story */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: "#1c1917", color: "#f5f5f4" }}>
        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#fcd34d" }}>The Problem</div>
        <h2 className="text-lg font-bold mb-3">Enterprise AI moves at the speed of data trust.</h2>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#d6d3d1" }}>
          At enterprise retailers, dozens of AI initiatives — churn models, real-time personalization, inventory forecasting, experiment analysis — all depend on a shared data platform. But data quality is almost never tracked in a way that connects to business outcomes. A model team discovers a dataset is broken <em>after</em> they've built on it. A PM can't answer "why is the churn model underperforming?" without a three-day investigation.
        </p>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#d6d3d1" }}>
          DataTrust AI is the system that makes data quality <strong style={{ color: "#fcd34d" }}>visible, actionable, and tied to business impact</strong> before things break. It answers three executive questions: Which datasets are AI-ready? What's blocking the rest? And where should we invest first?
        </p>
        <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {[
            { stat: "9", label: "Quality dimensions scored per dataset" },
            { stat: "6", label: "Data products with full AI readiness profiles" },
            { stat: "25+", label: "AI use cases evaluated with fit reports" },
          ].map((item) => (
            <div key={item.stat} className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: "#fcd34d" }}>{item.stat}</div>
              <div className="text-xs" style={{ color: "#a8a29e" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PM pitch */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">Why This Problem at Sam's Club Scale</h2>
        <p className="text-xs text-slate-400 mb-4">Built as a portfolio project for the PM III, Data Products role</p>

        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          Sam's Club is running some of the most ambitious AI programs in retail — personalized member experiences powered by Member 360, frictionless checkout via Scan & Go, computer vision at exit, AI-driven replenishment, and a growing Retail Media business that needs clean attribution data to compete with Amazon. All of it runs on the same shared data platform.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          At 700+ clubs and 32M+ members, a single data quality gap doesn't break one thing — it silently propagates. A missing <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">session_id</code> on 18% of Scan & Go events biases 8 live experiments at once. An unversioned SKU taxonomy change breaks replenishment models across 23% of club revenue — for weeks before anyone notices. There is no system today that surfaces these risks to a PM before they become incidents.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          DataTrust AI is my answer to that gap: a data product intelligence layer that gives a PM or data leader a clear, real-time view of which datasets are trustworthy, which AI use cases are blocked, and exactly where to invest first to unblock the roadmap.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { title: "Data product PM thinking", desc: "Every quality gap is expressed as a downstream business consequence — not a technical metric." },
            { title: "AI/ML enablement lens", desc: "Quality dimensions are weighted by use case. Freshness matters differently for real-time inference vs. batch training." },
            { title: "PM prioritization rigor", desc: "The backlog ranks fixes by severity × users × blocked use cases, with written rationale for every decision." },
            { title: "Trust as a product feature", desc: "The Use-Case Fit report gives a PM a defensible, documented answer to 'can we build on this data?' — before the team starts building." },
          ].map((item) => (
            <div key={item.title} className="rounded-lg p-3" style={{ background: "#faf9f6", border: "1px solid #e7e5e4" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#1c1917" }}>{item.title}</div>
              <div className="text-xs" style={{ color: "#78716c" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What is a data product */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-3">What is a Data Product?</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          A data product is a <strong>trusted, reusable, owned data asset</strong> designed around a defined user need and measurable business outcome. Unlike a raw database table, a data product has:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "A named owner", desc: "Someone accountable for quality, freshness, and documentation" },
            { label: "A defined SLA", desc: "Freshness and availability commitments to downstream consumers" },
            { label: "A data contract", desc: "Formal schema and quality guarantees for consumers" },
            { label: "Approved use cases", desc: "Clear guidance on what the data can and cannot be used for" },
            { label: "Quality monitoring", desc: "Automated checks that alert when data drifts from expectations" },
            { label: "Adoption metrics", desc: "Measurement of who uses the data and how frequently" },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="text-xs font-semibold text-slate-800 mb-0.5">{item.label}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What is AI Readiness */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-3">What is AI Readiness?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          AI Readiness is a configurable assessment of whether a data product is sufficiently <strong>reliable, governed, documented, and operationally suitable</strong> for a specific AI use case. A dataset can be highly ready for batch recommendations but completely unready for real-time personalization — which is why use-case-specific evaluation is core to this framework.
        </p>
        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          {[
            { range: "90–100", label: "AI Ready", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
            { range: "75–89", label: "Conditionally Ready", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { range: "60–74", label: "Needs Remediation", color: "bg-orange-50 border-orange-200 text-orange-700" },
            { range: "Below 60", label: "High Risk", color: "bg-red-50 border-red-200 text-red-700" },
          ].map((tier) => (
            <div key={tier.label} className={`rounded-lg border p-3 ${tier.color}`}>
              <div className="text-sm font-bold mb-0.5">{tier.range}</div>
              <div className="text-xs font-medium">{tier.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring model */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Scoring Methodology</h2>
          <p className="text-xs text-slate-500 mt-0.5">The AI Readiness Score is a weighted average across 9 quality dimensions</p>
        </div>
        <div className="divide-y divide-slate-50">
          {scoringDimensions.map((dim) => (
            <div key={dim.name} className="px-6 py-4 flex items-start gap-4">
              <div className="shrink-0 w-12 text-center">
                <div className="text-lg font-bold text-amber-700">{dim.weight}%</div>
                <div className="text-xs text-slate-400">weight</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800 mb-0.5">{dim.name}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{dim.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use-case-specific weighting */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Use-Case-Specific Weighting Examples</h2>
        <div className="space-y-4">
          {useCaseWeightExamples.map((example) => (
            <div key={example.useCase} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="text-sm font-semibold text-slate-800 mb-1">{example.useCase}</div>
              <p className="text-xs text-slate-500 mb-3">{example.rationale}</p>
              <div className="flex flex-wrap gap-2">
                {example.topDimensions.map((dim) => (
                  <div key={dim.name} className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5">
                    <span className="text-xs font-bold text-amber-700">{dim.weight}%</span>
                    <span className="text-xs text-slate-600">{dim.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Principles */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Product Principles</h2>
        <div className="space-y-4">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-amber-700" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 mb-0.5">
                    <span className="text-amber-600 mr-1">{i + 1}.</span> {p.title}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Technical Architecture</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Framework", value: "Next.js 16 · App Router · TypeScript" },
            { label: "Styling", value: "Tailwind CSS v4 · Custom design system" },
            { label: "Charts", value: "Recharts · RadarChart, BarChart, AreaChart" },
            { label: "Animations", value: "Framer Motion · Subtle transitions" },
            { label: "Data Layer", value: "Local TypeScript mock data · No backend required" },
            { label: "AI Copilot", value: "Claude Haiku via Anthropic API · Streaming responses · Full catalog context in system prompt" },
            { label: "State", value: "React useState · Component-local state" },
            { label: "Icons", value: "Lucide React" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-700">{item.label}</div>
                <div className="text-xs text-slate-500">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-amber-800 mb-2">Synthetic Data Disclaimer</h3>
        <p className="text-xs text-amber-700 leading-relaxed">
          All data products, quality scores, incident details, and business metrics shown in this application are entirely synthetic and created for portfolio demonstration purposes. This project is not affiliated with, endorsed by, or built using data from Walmart, Sam's Club, or any of their subsidiaries. No proprietary business data, internal systems, or confidential information was used in the creation of this application.
        </p>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-slate-400">
          Demo built with synthetic retail data for portfolio purposes. No proprietary company data used.
        </p>
      </div>
    </div>
  );
}
