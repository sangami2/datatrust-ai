# DataTrust AI

**A data product intelligence platform that tells you which datasets are ready for AI, what's blocking the rest, and where to invest first.**

Built as a portfolio project for the PM III, Data Products role at Sam's Club. Modeled around real enterprise retail data problems — Member 360, Scan & Go, Retail Media, Inventory Signals, and more.

🔗 **[Live Demo](https://datatrust-ai.vercel.app)**

### Demo Walkthrough

https://github.com/user-attachments/assets/b7b3ed5c-e9ac-4f6b-a9be-09db98c5db00

> **Synthetic Data Disclaimer:** All data products, quality scores, incidents, and business metrics are entirely synthetic and created for portfolio demonstration purposes. This project is not affiliated with, endorsed by, or built using data from Walmart, Sam's Club, or any of their subsidiaries. No proprietary data was used.

---

## The Problem

At enterprise retailers, dozens of AI initiatives — churn models, real-time personalization, inventory forecasting, experiment analysis — all depend on a shared data platform. But data quality is almost never tracked in a way that connects to business outcomes.

A model team discovers a dataset is broken *after* they've built on it. A PM can't answer "why is the churn model underperforming?" without a three-day investigation. A missing field on 18% of Scan & Go events biases 8 live experiments simultaneously. An unversioned SKU taxonomy change breaks replenishment models across 23% of club revenue — for weeks before anyone notices.

DataTrust AI is the system that makes data quality **visible, actionable, and tied to business impact** before things break.

---

## How It Works

### 1. AI Readiness Score
Every data product is scored 0–100 across 9 quality dimensions, weighted by how much each dimension matters for AI use cases.

| Dimension | Weight |
|-----------|--------|
| Freshness | 15% |
| Completeness | 15% |
| Accuracy / Validity | 15% |
| Schema Stability | 10% |
| Documentation | 10% |
| Ownership | 10% |
| Privacy / Governance | 10% |
| Model Readiness | 10% |
| Adoption / Reuse | 5% |

Score bands:

| Score | Label |
|-------|-------|
| 90–100 | AI Ready |
| 75–89 | Conditionally Ready |
| 60–74 | Needs Fixing |
| Below 60 | High Risk |

Weights adjust per use case — real-time personalization weights Freshness at 30%, churn prediction weights Completeness at 25%.

---

### 2. Data Catalog
Six fully profiled data products, each with:
- AI Readiness Score + readiness tier
- PM Summary explaining the current state
- Weekly score trend
- Open incident count
- SLA breach risk indicator

| Dataset | Score | Status |
|---------|-------|--------|
| Experiment Registry | 88 | Conditionally Ready |
| Scan & Go Events | 86 | Conditionally Ready |
| Exit Experience Events | 81 | Conditionally Ready |
| Member 360 | 78 | Conditionally Ready |
| Inventory Signals | 73 | Needs Fixing |
| Retail Media Campaign Performance | 69 | Needs Fixing |

---

### 3. Dataset Detail (6 tabs)
Each dataset has a full profile:

- **Overview** — PM Summary, key metadata, upstream/downstream dependencies
- **Quality** — All 9 dimension scores with evidence, business impact, and recommended action. Weak dimensions surface inline without requiring a click.
- **AI Use Cases** — Which use cases are approved, which are blocked, and why
- **Incidents** — Open quality issues with severity, affected use cases, and steps to fix
- **Adoption** — Active users, repeat use rate, team breakdown, adoption trend
- **Documentation** — Field definitions, data contract status, known caveats

---

### 4. AI Use-Case Fit Assessment
A 3-step wizard that answers: *"Can we build this AI use case on this dataset?"*

1. **Choose a use case** — Churn Prediction, Real-time Personalization, ROAS Analysis, etc.
2. **Select datasets** — See fit scores and readiness badges for each
3. **View the fit report** — Color-coded verdict (Ready / Conditional / Not Ready), blocker summary, estimated business lift if fixed, and numbered steps to resolve blockers

---

### 5. PM Prioritization Dashboard
An interactive backlog where the PM sets effort and time per item based on engineering input. The list re-ranks and the matrix updates automatically.

- **Effort dropdown** per item (Low / Medium / High) — set after talking to engineering
- **Time estimate** — editable text field
- **Priority score** recalculates dynamically based on effort × impact × users affected × AI use cases blocked
- **Scope badge** auto-assigns: Quick Win / Easy Pick / High Value / Medium Lift / Big Bet / Consider Later
- **Effort vs. Business Impact matrix** updates live as you change effort
- **PM rationale** written out for every item explaining the prioritization decision

---

### 6. Incident Center
All open quality incidents across the catalog with:
- Severity badges (Critical / High / Medium / Low)
- Affected AI use cases
- Business impact callout (in dollars/members/revenue)
- Steps to fix
- AI-generated incident summary

---

### 7. AI Data Copilot
A floating chat widget (bottom-right corner) powered by **Claude Haiku via Anthropic API** with streaming responses.

Has full context on all 6 data products — scores, incidents, quality dimensions, approved use cases, and PM narratives. Ask it anything:
- *"Which datasets are ready for churn prediction?"*
- *"Why is Retail Media not AI-ready?"*
- *"What's the highest priority fix this quarter?"*
- *"Can I use Scan & Go Events for funnel experimentation?"*

---

## Tech Stack

| Concern | Technology |
|---------|-----------|
| Framework | Next.js 16 · App Router · TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Claude Haiku · Anthropic SDK · Streaming |
| Deployment | Vercel |

---

## Running Locally

```bash
npm install
```

Create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The app works without the API key — the copilot just won't connect to Claude.

---

*Demo built with synthetic retail data for portfolio purposes. No proprietary company data used.*
