# Contributing to ShareThrift

Thank you for your interest in improving ShareThrift. This guide explains how to propose changes, create issues (including using GitHub Copilot’s coding agent), follow Domain-Driven Design (DDD) conventions, and get your pull requests reviewed and merged.

## Principles & Project Scope
ShareThrift promotes sustainable reuse via a peer‑to‑peer sharing platform. We prioritize:
- Clear business‑aligned domain models (aggregates, entities, value objects)
- Maintainable modular boundaries (bounded contexts)
- Event-driven evolution (domain & future integration events)
- Simplicity first; avoid premature generalization

## Ways to Contribute
- Report bugs & usability issues
- Propose enhancements (features, performance, observability, tooling)
- Improve domain model clarity & documentation
- Add tests (unit, integration, scenario/feature)
- Write or refine ADRs for architectural decisions
- Improve developer experience (scripts, tasks)

## Issue Creation Workflow (Copilot & Manual)
### Manual Issue
1. Click “New Issue” in the repository.
2. Use a clear title: `listing: implement pause/resume state`.
3. Provide context: brief description (business rationale, acceptance criteria).
4. Add labels: `domain`, `ui`, `tech-debt`, `documentation`, etc.
5. Assign yourself, Copilot, or another contributor.

### Copilot-Assisted Issue
If you want the GitHub Copilot coding agent to implement the task:
1. Open GitHub → Copilot Home
2. Make sure your ShareThrift repository is added/selected at the top.
3. In the prompt/input box, describe the task you want Copilot to generate as an issue.
`/create-issue create an issue to implement pause/resume state machine for listings`
4. Copilot will generate a draft issue automatically.
5. Review the created draft:
    - Title
    - Description
    - Acceptance Criteria
    - Links ([ADRs](./apps/docs/docs/decisions/) if applicable)
6. Edit the generated issue if needed (DO NOT skip reviewing).
7. Add labels: `domain`, `ui`, `tech-debt`, `documentation`, etc.
8. Assign yourself, Copilot, or another contributor.

![github_create_task](./readme-assets/github_create_task.png)

![github_create_task_2](./readme-assets/github_create_task_2.png)

![github_create_task_3](./readme-assets/github_create_task_3.png)

Copilot will attempt to open a Pull Request automatically. Monitor its progress, review the PR thoroughly, and request adjustments as needed.

If the task is assigned to the Copilot user, the agent will create a branch and PR (for example, `copilot/issue-XYZ`).

## Pull Request Process & Review Guidelines
1. Branch from `main` using a descriptive name: `feature/listing-lifecycle`, `fix/messaging-timeout`.
2. Keep PRs focused; avoid mixing refactors with new features.
3. Ensure build succeeds: `pnpm run build`.
4. Ensure tests pass: `pnpm test` and maintain coverage.
5. Run lint/format: `pnpm run lint` (Biome).
6. Update or add ADRs for architectural changes.
7. Provide PR description:
   - Problem statement
   - Solution summary
   - Affected domain concepts
   - Testing evidence (screenshots/logs if UI/telemetry)
8. Request review from domain owners / maintainers.
9. Address comments promptly and explain trade‑offs when declining suggestions.
10. Squash commits if noisy or fixup commits exist; maintain clear history.

### Reviewer checks:
- Domain invariants upheld
- No leakage of infrastructure into domain layer
- Proper file naming & exports
- Adequate test coverage & meaningful assertions
- No unexplained new dependencies

### Pull Request ↔ Task State Alignment
To keep work status clearly visible and aligned with the task board, we follow a strict mapping between task state and Pull Request (PR) state:

#### Task → PR State Mapping
- Task: In Progress
    - PR must be in Draft
    - Indicates active development or ongoing changes
- Task: In Review
    - PR must be marked Ready for Review
    - Indicates the work is complete and awaiting reviewer feedback

#### Review Feedback Handling
- If review feedback is received that requires changes:
    - Move the task back to In Progress
    - Convert the PR back to Draft
- Once updates are complete:
    - Move the task to In Review
    - Mark the PR Ready for Review again

This means tasks and PRs may bounce between these states multiple times during development. While this requires some manual coordination, it ensures reviewers and maintainers have an accurate, real-time view of active work.

## Naming & File Conventions
- Kebab-case for file & folder names: `listing-reservation.aggregate.ts`
- Aggregate root file ends with `.aggregate.ts`
- Entity file ends with `.entity.ts`
- Avoid one-letter variable names; prefer intention-revealing naming

## Domain & DDD Conventions

- Bounded contexts under [packages/sthrift/domain/src/domain/contexts/](./packages/sthrift/domain/src/domain/contexts/)
- Each context exposes a clear ubiquitous language via exports
- Passports/Visas enforce permission checks at aggregate boundaries
- Value Objects are immutable, with validation (no side effects)
- Aggregates guard invariants and emit domain events
- Repositories are defined as interfaces in the domain; adapters live outside
- Unit of Work plans atomic persistence and event publication


## Facade Pattern & Package Responsibilities
ShareThrift uses a **facade pattern** to separate shared interfaces from ShareThrift-specific implementations. This allows implementations to be swapped (for example, by environment) without changing business logic.

- `cellix` defines **interfaces and shared contracts**
- `sthrift` contains **ShareThrift domain logic** and **implements `cellix` interfaces**
- API and service layers depend only on interfaces, not concrete implementations

**Example:**  
`cellix/service-messaging` defines a messaging interface.  
`sthrift/service-messaging-twilio` and `sthrift/service-messaging-mock` provide concrete implementations selected at runtime.

### Package Responsibilities
**`sthrift`**
- Domain models, business rules, and domain events  
- Implementations of `cellix` interfaces  
- Facades consumed by APIs and services  

**`cellix`**
- Interface-only packages (facades)  
- Shared abstractions and cross-cutting utilities  
- No ShareThrift-specific logic or implementations  

### Dependency Rules
- `sthrift` may depend on `cellix`
- `cellix` must never depend on `sthrift`

## Testing & Quality Requirements
- Every aggregate, entity, value object: unit tests + scenario ([`.feature`](./packages/sthrift/service-sendgrid/src/features/)) files
- Use Vitest for tests; avoid broad integration unless required
- Assert domain invariants explicitly (not just property presence)
- Maintain or improve coverage; do not submit PRs that reduce quality gates

Example commands:
```bash
pnpm run build
pnpm test
pnpm run lint
```

## Documentation & ADRs
- Significant architectural shifts require an ADR ([apps/docs/docs/decisions](./apps/docs/docs/decisions/) folder)
- Reference existing ADRs (DDD, telemetry, infra) when building upon patterns

## Dependencies & Technology Decisions
- Before adding a new dependency: evaluate footprint, security posture, maintenance status
- For domain logic: avoid infrastructure libraries directly
- Add dependency rationale in PR description or ADR if impactful

## Security & Vulnerability Reporting
- Do not include secrets in code or commits

## Contributor Resources
- README (architecture, roadmap)
- BRD/SRD: business and system requirements [documents](./documents/)
- ADRs: architectural decision history

## Asking for Help
If you need any help while contributing, feel free to email the maintainer (`pgidich@ecfmg.org`). We are more than happy to assist!

By contributing to ShareThrift, you agree to follow our Code of Conduct. → See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

Thank you for your contributions! 👍