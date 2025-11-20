# ShareThrift

A modern, community‑driven platform designed to reduce waste and enable the sharing of items, services, and classes — empowering individuals and organizations to participate in the circular economy.

## 📌 Introduction

ShareThrift is a web‑based peer‑to‑peer sharing platform that enables people and organizations to lend, borrow, or offer items, services, and classes. Inspired by platforms like Turo, Airbnb, and Facebook Marketplace — but built specifically for the sharing economy — ShareThrift provides a structured, trusted, and community-first way to exchange goods.

### ShareThrift exists to:

- Reduce consumer waste by extending item lifecycles
- Enable cost‑efficient access to tools, equipment, and skills
- Support individuals, small businesses, and partners with flexible sharing models
- Explore modern technology and product design patterns through an MVP implementation
- This project is built using Domain-Driven Design (DDD), event-driven communication, and modular application boundaries as specified in the official BRD/SRD.

## 🗂 Table of Contents
- Features
- Architecture
- Monorepo Structure
- Tech Stack
- Getting Started

## ✨ Features

### 🔍 Browse, Search & Filter Listings

- Filter by location, date availability, and category
- View active, inactive, and upcoming listings

### 🧰 Create & Manage Listings

- Support for Item, Service, and Class listings
- Draft, publish, pause, cancel, appeal, and reinstate listings
- AI‑assisted draft creation using the integrated chatbot

### 📅 Reservation Lifecycle

- Calendar‑based booking
- Accept, reject, cancel, and close reservation flows
- Email notifications for all major events

### 💬 Messaging

- In‑platform messaging between sharers and reservers
- Auto‑expiring conversation threads tied to listings

### 🛡 Admin Tools

- Listing moderation
- User blocking/unblocking
- Feature flag management
- Embedded analytics and reporting

## 🏗 Architecture

ShareThrift applies layered Domain-Driven Design:

- Domain Layer: aggregates, entities, value objects, domain events
- Application Layer: orchestration / services (future explicit service modules)
- Infrastructure Layer: persistence (Mongoose), telemetry, messaging adapters
- Interface Layer: Azure Functions entrypoints (GraphQL + planned REST)

Key patterns:

- Aggregates coordinate consistency boundaries
- Value Objects enforce immutability and constraints
- Unit of Work plans for atomic change sets
- Event-driven strategy (domain + integration events) evolving via ADRs
- Service Registry (Cellix.initializeServices) for dependency injection

## 🧬 Monorepo Structure
```
apps/
  api/            # Azure Functions host (GraphQL + future REST)
  docs/           # Docusaurus docs site
  ui-sharethrift/ # Front-end (Vite + TypeScript)
packages/
  sthrift/        # Domain + adapters (graphql, mongoose, etc.)
  cellix/         # Seedwork abstractions
iac/              # Bicep infrastructure modules
documents/        # BRD, SRD, ADRs, architecture diagrams
```

## 🛠 Tech Stack
- Runtime: Node.js 22.12.0 / Azure Functions v4
- Package Manager: pnpm
- Language: TypeScript (strict config)
- API: Apollo GraphQL
- Persistence: MongoDB (Mongoose); Cosmos MongoDB target in cloud
- Infra as Code: Bicep modules (iac)
- Tooling: Turborepo, Vitest, Biome, SonarQube, Sourcery
- Local Azure Emulation: Azurite (blob/queue)
- Observability: OpenTelemetry + Azure Monitor integration
- Quality Gates: Sonar + coverage thresholds per package


## 🚀 Getting Started
Prerequisites

- Node.js v22.12.0 (use nvm)
- Azurite

Install & Build
```
nvm use v22
pnpm install
pnpm run build
```

Run (Dev)
```
pnpm run dev
```

## 🔗 Local Endpoints

| Portal | Endpoint |
| --- | --- |
| Frontend | http://localhost:3000 |
| Doc | http://localhost:3002 |
| Graphql | http://localhost:7071/api/graphql |
