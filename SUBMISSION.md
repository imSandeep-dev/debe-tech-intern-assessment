# Submission — Debe Learning Tech Intern Assessment

## Part 1 — GitHub Portfolio Walkthrough

**GitHub Profile:** https://github.com/imSandeep-dev

### Project 1: Payment Orchestrator
**Repo:** https://github.com/imSandeep-dev/payment-orchestrator

**Problem it solves:** Payment orchestration systems need to route transactions across multiple gateways reliably, handle failures gracefully, and guarantee no duplicate charges — this simulates that core infrastructure.

**What I built:** Solo, over about 3 weeks — a 24-state transaction state machine, multi-gateway routing with circuit breakers, PostgreSQL-backed idempotency via advisory locks, and an HMAC-verified webhook pipeline, validated with 217 tests.

**One thing I'd change today:** I'd introduce an event-sourcing pattern for the state machine instead of mutating state directly — it would give a full audit trail of every transition, which matters for debugging and compliance in payment systems.

---

### Project 2: GrowEasy CRM CSV Importer
**Repo:** https://github.com/imSandeep-dev/groweasy-csv-importer

**Problem it solves:** Sales/marketing teams export leads from many different sources (Facebook Ads, Google Ads, CRMs, manual spreadsheets), each with inconsistent column layouts. This tool automates mapping them into a fixed CRM schema using an LLM that infers field meaning from header text and data shape.

**What I built:** The entire thing solo, as a 1-day case-study assignment for an internship application — the Next.js/TypeScript frontend and the backend API route that batches CSV rows, calls the LLM with a strict schema-enforcing prompt, and validates every returned field server-side. (Note: this was originally built in a single day as a timed assignment, which is why the commit history is tightly clustered rather than spread over weeks.)

**One thing I'd change today:** Add persistent storage instead of session-only results — right now closing the browser mid-import loses everything.
