# DataTrust AI

**Know which data products are ready to power AI — and what to fix when they are not.**

DataTrust AI is a prototype for data-product teams managing AI readiness across enterprise data assets. It helps teams discover trusted datasets, evaluate fitness for AI use cases, identify quality blockers, and prioritize remediation based on business impact.

> **Synthetic Data Disclaimer:** All data products, quality scores, incidents, and business metrics in this application are entirely synthetic and created for portfolio demonstration purposes. This project is not affiliated with, endorsed by, or built using data from Walmart, Sam's Club, or any of their subsidiaries. No proprietary data was used.

---

## Screenshots

| Dashboard | Data Catalog | Dataset Detail |
|-----------|-------------|----------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

| Incident Center | Prioritization | AI Copilot |
|----------------|---------------|------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd datatrust-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

---

## App Structure

```
app/
  page.tsx                    # Executive Dashboard
  catalog/
    page.tsx                  # Data Catalog (search + filter)
    [id]/page.tsx             # Dataset Detail (6 tabs)
  use-case-fit/page.tsx       # AI Use-Case Fit Assessment (3-step wizard)
  incidents/page.tsx          # Incident Center (with detail drawer)
  prioritization/page.tsx     # PM Prioritization Dashboard
  copilot/page.tsx            # AI Data Copilot (chat interface)
  about/page.tsx              # Project Overview & Methodology

components/
  layout/                     # Sidebar, TopBar
  ui/                         # ReadinessBadge, ScoreRing, SeverityBadge, StatusBadge
  dashboard/                  # ReadinessBarChart
  catalog/                    # CatalogClient (search/filter)
  dataset/                    # DatasetDetail, QualityChart, AdoptionChart
  incidents/                  # IncidentsClient (with slide-in drawer)
  prioritization/             # PrioritizationClient (matrix + backlog)
  copilot/                    # CopilotClient (chat)
  use-case-fit/               # UseCaseFitClient (3-step wizard)

lib/
  mock-data.ts                # All synthetic data products and incidents
  scoring.ts                  # Scoring model logic and use-case weight overrides
  copilot-engine.ts           # Deterministic copilot response engine
  utils.ts                    # Color helpers, date formatting, cn()

types/
  data-product.ts             # DataProduct, QualityDimension, UseCaseFit, etc.
  incident.ts                 # Incident type
  use-case.ts                 # UseCaseDefinition, UseCaseFitReport
```

---

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Framework | Next.js 16 · App Router · TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts (Bar, Radar, Area, Line, Scatter) |
| Animations | Framer Motion (available) |
| Icons | Lucide React |
| State | React useState (component-local) |
| Data | Local TypeScript mock data (no backend) |
| Deployment | Vercel-ready (static export compatible) |

---

## Scoring Model

The AI Readiness Score (0–100) is a weighted average across 9 quality dimensions:

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Freshness | 15% | How current is the data vs. its SLA? |
| Completeness | 15% | Are critical fields populated at expected rates? |
| Accuracy / Validity | 15% | Does the data reflect reality and conform to schema? |
| Schema Stability | 10% | How frequently does the schema change? |
| Documentation | 10% | Are fields, caveats, and methods documented? |
| Ownership | 10% | Is there a named owner with defined SLAs? |
| Privacy / Governance | 10% | Is it classified, access-controlled, and compliant? |
| Model Readiness | 10% | Is the data structured for ML consumption? |
| Adoption / Reuse | 5% | How widely is the dataset used and trusted? |

### Score Labels

| Score | Label |
|-------|-------|
| 90–100 | AI Ready |
| 75–89 | Conditionally Ready |
| 60–74 | Needs Remediation |
| Below 60 | High Risk |

Weights are adjusted per use case. Real-time personalization weights Freshness at 30%; Churn Prediction weights Completeness at 25%.

---

## Demo Data Products

| Dataset | Score | Status |
|---------|-------|--------|
| Experiment Registry | 88 | Conditionally Ready |
| Scan & Go Events | 86 | Conditionally Ready |
| Exit Experience Events | 81 | Conditionally Ready |
| Member 360 | 78 | Conditionally Ready |
| Inventory Signals | 73 | Needs Remediation |
| Retail Media Campaign Performance | 69 | Needs Remediation |

## Demo Use Cases

- Member Churn Prediction
- Batch Recommendations
- Real-time Personalization
- Scan & Go Adoption Modeling
- Retail Media Audience Targeting
- Campaign Attribution
- Inventory Forecasting
- A/B Experiment Analysis
- Exit-Friction Optimization

---

## AI Copilot

The copilot uses a deterministic local response engine that matches user queries to known dataset context. The engine is designed so that an LLM API can replace the local engine with a single function swap in `lib/copilot-engine.ts`.

Sample prompts:
- "Which datasets are ready for member churn prediction?"
- "Why is Retail Media Campaign Performance not AI-ready?"
- "What should we fix first to unlock real-time personalization?"
- "Summarize the highest-priority incidents this week."

---

## Product Principles

1. **Explainable scoring** — Every score is decomposed into dimension-level evidence, business impact, and recommended actions
2. **Use-case-specific evaluation** — Quality dimension weights adapt to the target use case
3. **Clear ownership** — Every data product has a named owner, team, and escalation path
4. **Actionable remediation** — Every quality issue has a root-cause hypothesis and prioritized remediation steps
5. **Adoption and business impact** — Quality improvements are ranked by downstream user impact and AI use cases unblocked

---

*Demo built with synthetic retail data for portfolio purposes. No proprietary company data used.*
