import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clipboard,
  Copy,
  FileText,
  Gauge,
  ListChecks,
  Search,
  ShieldCheck,
  Siren,
} from 'lucide-react'
import './App.css'

type EvidenceStatus = 'Match' | 'Partial' | 'Mismatch' | 'Missing' | 'Needs review'

type EvidenceRow = {
  field: string
  customer: string
  watchlist: string
  status: EvidenceStatus
  note: string
}

type ChecklistItem = {
  label: string
  status: EvidenceStatus
}

type Transaction = {
  label: string
  amount: string
  risk: 'Normal' | 'Watch' | 'High'
}

type Scenario = {
  id: string
  customerName: string
  customerType: string
  queueDetail: string
  queueStatus: string
  priority: 'Low' | 'Medium' | 'High'
  watchlistName: string
  program: string
  alertReason: string
  matchConfidence: number
  riskScore: number
  disposition: string
  escalation: string
  decisionQuality: string
  auditReadiness: number
  evidenceRows: EvidenceRow[]
  checklist: ChecklistItem[]
  transactions: Transaction[]
  riskRationale: string
  nextAction: string
  memo: string
}

const scenarios: Scenario[] = [
  {
    id: 'alexei-petrov',
    customerName: 'Alexei Petrov',
    customerType: 'Individual',
    queueDetail: 'Partial name match',
    queueStatus: 'Needs review',
    priority: 'Low',
    watchlistName: 'Aleksey Petrov',
    program: 'OFAC SDN',
    alertReason: 'Name similarity triggered the sanctions screening engine.',
    matchConfidence: 18,
    riskScore: 12,
    disposition: 'Likely false positive',
    escalation: 'Not required',
    decisionQuality: 'Evidence complete',
    auditReadiness: 94,
    evidenceRows: [
      {
        field: 'Name',
        customer: 'Alexei Petrov',
        watchlist: 'Aleksey Petrov',
        status: 'Partial',
        note: 'Similar spelling, not an exact identifier match.',
      },
      {
        field: 'Date of birth',
        customer: '1989-04-12',
        watchlist: '1972-11-03',
        status: 'Mismatch',
        note: 'Full date of birth does not align.',
      },
      {
        field: 'Country',
        customer: 'United States',
        watchlist: 'Russia',
        status: 'Mismatch',
        note: 'Residence and listed country differ.',
      },
      {
        field: 'Address',
        customer: 'Brooklyn, NY',
        watchlist: 'Moscow, Russia',
        status: 'Mismatch',
        note: 'No address overlap in available data.',
      },
      {
        field: 'Entity type',
        customer: 'Individual',
        watchlist: 'Individual',
        status: 'Match',
        note: 'Same entity category.',
      },
      {
        field: 'Transaction exposure',
        customer: 'Germany wire, cloud subscription, rent',
        watchlist: 'Sanctions program match',
        status: 'Mismatch',
        note: 'No sanctioned jurisdiction or high-risk counterparty detected.',
      },
    ],
    checklist: [
      { label: 'Name similarity', status: 'Partial' },
      { label: 'Date of birth', status: 'Mismatch' },
      { label: 'Country', status: 'Mismatch' },
      { label: 'Address', status: 'Mismatch' },
      { label: 'Entity type', status: 'Match' },
      { label: 'Watchlist source', status: 'Match' },
      { label: 'Transaction jurisdiction', status: 'Mismatch' },
      { label: 'Counterparty risk', status: 'Mismatch' },
      { label: 'Adverse media', status: 'Missing' },
      { label: 'Missing evidence', status: 'Mismatch' },
    ],
    transactions: [
      { label: 'Wire to Germany for software services', amount: '$2,400', risk: 'Normal' },
      { label: 'Subscription payment to cloud provider', amount: '$180', risk: 'Normal' },
      { label: 'Rent payment', amount: '$950', risk: 'Normal' },
    ],
    riskRationale:
      'The alert appears to be a likely false positive. The screening engine triggered on name similarity, but key identifiers do not align. The customer date of birth, address, and country differ from the watchlist profile, and recent transaction activity does not show exposure to sanctioned jurisdictions or high-risk counterparties.',
    nextAction: 'Prepare close documentation for analyst review.',
    memo: `Case summary:
Sanctions alert triggered due to partial name similarity between customer Alexei Petrov and listed individual Aleksey Petrov.

Review performed:
Compared name, date of birth, country, address, entity type, watchlist program, and recent transaction activity against the watchlist profile.

Findings:
Only the entity type matched. Name similarity was partial. Date of birth, address, and country did not match. No transaction exposure to sanctioned jurisdictions or high-risk counterparties was identified in the mock evidence.

Conclusion:
Likely false positive.

Recommended disposition:
Close alert with documentation after analyst review.

Analyst note:
If future transactions involve sanctioned jurisdictions, shell entities, or new adverse media, reopen for enhanced review.`,
  },
  {
    id: 'global-meridian',
    customerName: 'Global Meridian Trading LLC',
    customerType: 'Entity',
    queueDetail: 'Entity name match',
    queueStatus: 'High risk',
    priority: 'High',
    watchlistName: 'Global Meridian Trade',
    program: 'OFAC SDN',
    alertReason: 'Entity alias similarity and suspicious invoice payment triggered review.',
    matchConfidence: 78,
    riskScore: 86,
    disposition: 'Escalate',
    escalation: 'Enhanced due diligence',
    decisionQuality: 'Corroborating risk signals',
    auditReadiness: 88,
    evidenceRows: [
      {
        field: 'Name',
        customer: 'Global Meridian Trading LLC',
        watchlist: 'Global Meridian Trade',
        status: 'Partial',
        note: 'Close entity-name overlap and similar trading descriptor.',
      },
      {
        field: 'Registration country',
        customer: 'United Arab Emirates',
        watchlist: 'United Arab Emirates',
        status: 'Match',
        note: 'Jurisdiction overlaps with listed entity profile.',
      },
      {
        field: 'Address',
        customer: 'Jebel Ali Free Zone, Dubai',
        watchlist: 'Dubai trade district',
        status: 'Partial',
        note: 'Same metro trade zone, incomplete street-level evidence.',
      },
      {
        field: 'Entity type',
        customer: 'Limited liability company',
        watchlist: 'Trading company',
        status: 'Partial',
        note: 'Commercial entity types are compatible but not identical.',
      },
      {
        field: 'Watchlist source',
        customer: 'Screening engine hit',
        watchlist: 'OFAC SDN alias',
        status: 'Match',
        note: 'Watchlist source is a sanctions program.',
      },
      {
        field: 'Transaction exposure',
        customer: '$48,900 invoice payment via layered counterparty',
        watchlist: 'Sanctioned entity alias',
        status: 'Needs review',
        note: 'Payment pattern and counterparty route require enhanced review.',
      },
    ],
    checklist: [
      { label: 'Name similarity', status: 'Partial' },
      { label: 'Date of birth', status: 'Mismatch' },
      { label: 'Country', status: 'Match' },
      { label: 'Address', status: 'Partial' },
      { label: 'Entity type', status: 'Partial' },
      { label: 'Watchlist source', status: 'Match' },
      { label: 'Transaction jurisdiction', status: 'Needs review' },
      { label: 'Counterparty risk', status: 'Needs review' },
      { label: 'Adverse media', status: 'Needs review' },
      { label: 'Missing evidence', status: 'Needs review' },
    ],
    transactions: [
      { label: 'Invoice payment routed through layered counterparty', amount: '$48,900', risk: 'High' },
      { label: 'Recurring freight forwarding fee', amount: '$12,700', risk: 'Watch' },
      { label: 'Corporate card software expense', amount: '$620', risk: 'Normal' },
    ],
    riskRationale:
      'The alert presents multiple escalation indicators. The entity name is similar to a listed alias, the operating jurisdiction overlaps, and one invoice payment shows routing through a layered counterparty. The current evidence does not establish a final match, but the combination of identifier overlap and transaction behavior supports enhanced review.',
    nextAction: 'Route to sanctions escalation queue and request beneficial ownership documentation.',
    memo: `Case summary:
Sanctions alert triggered due to entity-name similarity between Global Meridian Trading LLC and the listed alias Global Meridian Trade.

Review performed:
Compared entity name, registration country, address, entity type, watchlist source, and recent transaction context.

Findings:
Name similarity is strong but not exact. Jurisdiction overlaps with the listed profile. Address evidence is partial, and recent invoice activity shows a layered counterparty route that requires enhanced review.

Conclusion:
Escalation recommended.

Recommended disposition:
Route for enhanced due diligence and beneficial ownership review.

Analyst note:
Request ownership records, invoice support, counterparty details, and sanctions-screen all related parties before disposition.`,
  },
  {
    id: 'maria-ivanova',
    customerName: 'Maria Ivanova',
    customerType: 'Individual',
    queueDetail: 'DOB missing',
    queueStatus: 'Needs information',
    priority: 'Medium',
    watchlistName: 'Maria Ivanova',
    program: 'EU Consolidated List',
    alertReason: 'Exact name and country match, with date of birth missing from customer file.',
    matchConfidence: 52,
    riskScore: 48,
    disposition: 'Request additional information',
    escalation: 'Pending evidence',
    decisionQuality: 'Evidence incomplete',
    auditReadiness: 76,
    evidenceRows: [
      {
        field: 'Name',
        customer: 'Maria Ivanova',
        watchlist: 'Maria Ivanova',
        status: 'Match',
        note: 'Exact name match.',
      },
      {
        field: 'Date of birth',
        customer: 'Not collected',
        watchlist: '1981-06-19',
        status: 'Missing',
        note: 'Key identifier is unavailable in the customer profile.',
      },
      {
        field: 'Country',
        customer: 'Bulgaria',
        watchlist: 'Bulgaria',
        status: 'Match',
        note: 'Country aligns with the watchlist profile.',
      },
      {
        field: 'Address',
        customer: 'Sofia, Bulgaria',
        watchlist: 'Varna, Bulgaria',
        status: 'Partial',
        note: 'Same country, different city.',
      },
      {
        field: 'Entity type',
        customer: 'Individual',
        watchlist: 'Individual',
        status: 'Match',
        note: 'Same entity category.',
      },
      {
        field: 'Transaction exposure',
        customer: 'Domestic salary and utilities',
        watchlist: 'Sanctions list entry',
        status: 'Mismatch',
        note: 'No high-risk counterparty in mock transaction history.',
      },
    ],
    checklist: [
      { label: 'Name similarity', status: 'Match' },
      { label: 'Date of birth', status: 'Missing' },
      { label: 'Country', status: 'Match' },
      { label: 'Address', status: 'Partial' },
      { label: 'Entity type', status: 'Match' },
      { label: 'Watchlist source', status: 'Match' },
      { label: 'Transaction jurisdiction', status: 'Mismatch' },
      { label: 'Counterparty risk', status: 'Mismatch' },
      { label: 'Adverse media', status: 'Missing' },
      { label: 'Missing evidence', status: 'Needs review' },
    ],
    transactions: [
      { label: 'Payroll deposit from local employer', amount: '$3,200', risk: 'Normal' },
      { label: 'Utility payment', amount: '$145', risk: 'Normal' },
      { label: 'Transfer to domestic savings account', amount: '$600', risk: 'Normal' },
    ],
    riskRationale:
      'The case cannot be closed from current evidence. Name, country, and entity type align with the watchlist entry, but the customer date of birth is missing and address details are only partially comparable. Transaction behavior does not add escalation pressure, so the strongest next step is targeted information collection.',
    nextAction: 'Request date of birth and secondary identifier before disposition.',
    memo: `Case summary:
Sanctions alert triggered by exact name match for Maria Ivanova and country overlap with a listed individual.

Review performed:
Compared available customer identifiers, watchlist data, address information, entity type, and recent transaction activity.

Findings:
Name, country, and entity type matched. Customer date of birth is missing, preventing a reliable identity comparison. Address information partially overlaps at country level but differs by city. Transaction activity does not show sanctioned jurisdiction exposure in the mock evidence.

Conclusion:
Additional information required.

Recommended disposition:
Request date of birth and a secondary identifier before closing or escalating.

Analyst note:
Do not rely on name and country alone. Reassess after collecting missing identity evidence.`,
  },
  {
    id: 'northstar-imports',
    customerName: 'Northstar Imports',
    customerType: 'Entity',
    queueDetail: 'Country exposure',
    queueStatus: 'Escalate',
    priority: 'High',
    watchlistName: 'No direct listed-party match',
    program: 'Jurisdiction exposure rule',
    alertReason: 'Payment routed through a high-risk jurisdiction with incomplete counterparty details.',
    matchConfidence: 71,
    riskScore: 79,
    disposition: 'Escalate for enhanced due diligence',
    escalation: 'Required',
    decisionQuality: 'Risk signals present',
    auditReadiness: 83,
    evidenceRows: [
      {
        field: 'Name',
        customer: 'Northstar Imports',
        watchlist: 'North Star Import Export',
        status: 'Partial',
        note: 'Commercial name similarity, no exact listed-party match.',
      },
      {
        field: 'Registration country',
        customer: 'Canada',
        watchlist: 'Not listed',
        status: 'Mismatch',
        note: 'Customer registration does not match watchlist geography.',
      },
      {
        field: 'Address',
        customer: 'Toronto, Canada',
        watchlist: 'Not available',
        status: 'Missing',
        note: 'No watchlist address available for comparison.',
      },
      {
        field: 'Entity type',
        customer: 'Importer',
        watchlist: 'Trading business',
        status: 'Partial',
        note: 'Commercial activity type is similar.',
      },
      {
        field: 'Watchlist source',
        customer: 'Transaction monitoring alert',
        watchlist: 'Jurisdiction exposure rule',
        status: 'Needs review',
        note: 'Alert is driven by payment route rather than direct list match.',
      },
      {
        field: 'Transaction exposure',
        customer: 'Payment routed through high-risk jurisdiction',
        watchlist: 'High-risk route detected',
        status: 'Match',
        note: 'Transaction context is the primary escalation driver.',
      },
    ],
    checklist: [
      { label: 'Name similarity', status: 'Partial' },
      { label: 'Date of birth', status: 'Mismatch' },
      { label: 'Country', status: 'Mismatch' },
      { label: 'Address', status: 'Missing' },
      { label: 'Entity type', status: 'Partial' },
      { label: 'Watchlist source', status: 'Needs review' },
      { label: 'Transaction jurisdiction', status: 'Match' },
      { label: 'Counterparty risk', status: 'Needs review' },
      { label: 'Adverse media', status: 'Missing' },
      { label: 'Missing evidence', status: 'Needs review' },
    ],
    transactions: [
      { label: 'Supplier payment routed through high-risk jurisdiction', amount: '$31,400', risk: 'High' },
      { label: 'Freight broker payment with incomplete invoice', amount: '$8,750', risk: 'Watch' },
      { label: 'Customs duty payment', amount: '$2,100', risk: 'Normal' },
    ],
    riskRationale:
      'The case is driven more by transaction exposure than by direct identity matching. There is no clear listed-party match, but a supplier payment routed through a high-risk jurisdiction and incomplete counterparty details create enough risk to support enhanced due diligence.',
    nextAction: 'Escalate transaction exposure and request counterparty documentation.',
    memo: `Case summary:
Alert triggered for Northstar Imports because a supplier payment was routed through a high-risk jurisdiction.

Review performed:
Compared business name, registration country, entity type, watchlist source, available address data, and transaction route evidence.

Findings:
No direct listed-party match was confirmed. Name and entity type show partial similarity to a trading-business profile, but the primary concern is transaction exposure. Counterparty details and supporting invoice evidence are incomplete.

Conclusion:
Escalation recommended for transaction exposure.

Recommended disposition:
Route for enhanced due diligence focused on counterparty identity, payment route, and invoice legitimacy.

Analyst note:
Request supplier ownership details, routing bank information, invoice support, and sanctions-screen all intermediaries before disposition.`,
  },
]

const statusClass: Record<EvidenceStatus, string> = {
  Match: 'status-match',
  Partial: 'status-partial',
  Mismatch: 'status-mismatch',
  Missing: 'status-missing',
  'Needs review': 'status-review',
}

const priorityClass: Record<Scenario['priority'], string> = {
  Low: 'priority-low',
  Medium: 'priority-medium',
  High: 'priority-high',
}

function App() {
  const [selectedId, setSelectedId] = useState(scenarios[0].id)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0],
    [selectedId],
  )

  const copyMemo = async () => {
    let didCopy: boolean

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }
      await navigator.clipboard.writeText(selectedScenario.memo)
      didCopy = true
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = selectedScenario.memo
      textArea.setAttribute('readonly', '')
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        didCopy = document.execCommand('copy')
      } catch {
        didCopy = false
      } finally {
        document.body.removeChild(textArea)
      }
    }

    setCopyState(didCopy ? 'copied' : 'error')
    window.setTimeout(() => setCopyState('idle'), 1800)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Day 8 / Bretton AI concept</p>
          <h1>SanctionLens</h1>
          <p className="subtitle">Sanctions alert investigation agent</p>
        </div>
        <div className="topbar-actions" aria-label="Product posture">
          <span className="badge">AML</span>
          <span className="badge">KYC</span>
          <span className="badge">Sanctions</span>
          <span className="badge badge-strong">Audit-ready memo</span>
        </div>
      </header>

      <section className="command-strip" aria-label="SanctionLens workflow">
        <div className="command-copy">
          <Search size={18} aria-hidden="true" />
          <span>Alert in</span>
          <span className="divider" aria-hidden="true" />
          <ShieldCheck size={18} aria-hidden="true" />
          <span>Investigation package out</span>
        </div>
        <p>
          Reviews screening alerts, compares evidence, recommends routing, and drafts a memo for
          human analyst review.
        </p>
      </section>

      <section className="workspace" aria-label="SanctionLens alert review workspace">
        <aside className="panel alert-queue" aria-label="Alert queue">
          <div className="panel-heading">
            <div>
              <p className="kicker">Queue</p>
              <h2>Alerts</h2>
            </div>
            <span className="queue-count">{scenarios.length}</span>
          </div>

          <div className="alert-list">
            {scenarios.map((scenario) => (
              <button
                className={`alert-card ${scenario.id === selectedScenario.id ? 'active' : ''}`}
                key={scenario.id}
                onClick={() => setSelectedId(scenario.id)}
                type="button"
              >
                <span className={`priority-dot ${priorityClass[scenario.priority]}`} />
                <span className="alert-card-main">
                  <strong>{scenario.customerName}</strong>
                  <span>{scenario.queueDetail}</span>
                </span>
                <span className="queue-status">{scenario.queueStatus}</span>
              </button>
            ))}
          </div>

          <div className="agent-steps">
            <div className="step-title">
              <ListChecks size={18} aria-hidden="true" />
              Agent workflow
            </div>
            <ol>
              <li>Alert intake</li>
              <li>Identifier comparison</li>
              <li>Context enrichment</li>
              <li>Decision recommendation</li>
              <li>Memo generation</li>
            </ol>
          </div>
        </aside>

        <section className="panel evidence-panel" aria-label="Evidence comparison">
          <div className="panel-heading split">
            <div>
              <p className="kicker">Customer profile vs watchlist profile</p>
              <h2>{selectedScenario.customerName}</h2>
            </div>
            <div className="watchlist-chip">
              <span>{selectedScenario.program}</span>
              <strong>{selectedScenario.watchlistName}</strong>
            </div>
          </div>

          <p className="alert-reason">{selectedScenario.alertReason}</p>

          <div className="comparison-table" role="table" aria-label="Evidence comparison table">
            <div className="table-row table-head" role="row">
              <span role="columnheader">Field</span>
              <span role="columnheader">Customer</span>
              <span role="columnheader">Watchlist</span>
              <span role="columnheader">Result</span>
            </div>
            {selectedScenario.evidenceRows.map((row) => (
              <div className="table-row" role="row" key={`${selectedScenario.id}-${row.field}`}>
                <span className="field-name" role="cell">
                  {row.field}
                </span>
                <span role="cell">{row.customer}</span>
                <span role="cell">{row.watchlist}</span>
                <span role="cell">
                  <span className={`status-pill ${statusClass[row.status]}`}>{row.status}</span>
                  <small>{row.note}</small>
                </span>
              </div>
            ))}
          </div>

          <div className="evidence-footer">
            <div>
              <h3>Evidence checklist</h3>
              <div className="checklist-grid">
                {selectedScenario.checklist.map((item) => (
                  <div className="check-item" key={`${selectedScenario.id}-${item.label}`}>
                    <span>{item.label}</span>
                    <span className={`status-pill compact ${statusClass[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3>Transaction context</h3>
              <div className="transaction-list">
                {selectedScenario.transactions.map((transaction) => (
                  <div className="transaction-item" key={`${selectedScenario.id}-${transaction.label}`}>
                    <span>
                      <strong>{transaction.amount}</strong>
                      {transaction.label}
                    </span>
                    <span className={`risk-tag risk-${transaction.risk.toLowerCase()}`}>
                      {transaction.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="panel decision-panel" aria-label="SanctionLens decision">
          <div className="panel-heading">
            <div>
              <p className="kicker">SanctionLens decision</p>
              <h2>Recommended routing</h2>
            </div>
            <Siren className="decision-icon" size={22} aria-hidden="true" />
          </div>

          <div className="score-grid">
            <ScoreCard
              icon={<Gauge size={18} aria-hidden="true" />}
              label="Match confidence"
              value={`${selectedScenario.matchConfidence}/100`}
              percent={selectedScenario.matchConfidence}
            />
            <ScoreCard
              icon={<AlertTriangle size={18} aria-hidden="true" />}
              label="Risk score"
              value={`${selectedScenario.riskScore}/100`}
              percent={selectedScenario.riskScore}
            />
          </div>

          <div className="decision-summary">
            <DecisionLine label="Recommended disposition" value={selectedScenario.disposition} />
            <DecisionLine label="Escalation" value={selectedScenario.escalation} />
            <DecisionLine label="Decision quality" value={selectedScenario.decisionQuality} />
            <DecisionLine label="Audit readiness" value={`${selectedScenario.auditReadiness}%`} />
          </div>

          <section className="rationale-block">
            <h3>
              <BadgeCheck size={17} aria-hidden="true" />
              Risk rationale
            </h3>
            <p>{selectedScenario.riskRationale}</p>
            <div className="next-action">
              <CheckCircle2 size={17} aria-hidden="true" />
              <span>{selectedScenario.nextAction}</span>
            </div>
          </section>

          <section className="memo-block">
            <div className="memo-heading">
              <h3>
                <FileText size={17} aria-hidden="true" />
                Analyst memo
              </h3>
              <button className="icon-button" onClick={copyMemo} type="button" aria-label="Copy analyst memo">
                {copyState === 'copied' ? (
                  <Clipboard size={17} aria-hidden="true" />
                ) : (
                  <Copy size={17} aria-hidden="true" />
                )}
                <span>
                  {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Retry' : 'Copy'}
                </span>
              </button>
            </div>
            <pre>{selectedScenario.memo}</pre>
          </section>
        </aside>
      </section>

      <section className="model-note" aria-label="Scoring model">
        <div>
          <h2>Scoring model</h2>
          <p>
            Match confidence weighs name, DOB, country, address, entity type, and transaction exposure.
            Risk score separately considers watchlist severity, jurisdiction exposure, adverse media,
            transaction behavior, missing evidence, and repeated alerts.
          </p>
        </div>
        <div className="model-columns">
          <div>
            <strong>Match confidence asks</strong>
            <span>Is this the same person or entity?</span>
          </div>
          <div>
            <strong>Risk score asks</strong>
            <span>Is this case risky enough to escalate?</span>
          </div>
        </div>
      </section>

      <footer className="disclaimer">
        SanctionLens is a concept demo using mock data. It does not make real compliance
        decisions, replace human analysts, or provide legal advice. Final decisions should be
        reviewed by qualified compliance professionals.
      </footer>
    </main>
  )
}

function ScoreCard({
  icon,
  label,
  value,
  percent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  percent: number
}) {
  return (
    <div className="score-card">
      <div className="score-top">
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function DecisionLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="decision-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export default App
