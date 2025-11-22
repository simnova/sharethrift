# Contributing to ShareThrift

Thank you for your interest in improving ShareThrift. This guide explains how to propose changes, create issues (including using GitHub Copilot’s coding agent), follow Domain-Driven Design (DDD) conventions, and get your pull requests reviewed and merged.

---
## Table of Contents
1. Principles & Project Scope
2. Code of Conduct
3. Ways to Contribute
4. Issue Creation Workflow (Manual & Copilot)
5. Assigning Work to GitHub Copilot Coding Agent
6. Pull Request Process & Review Guidelines
7. Architectural & Domain Standards (DDD)
8. Naming & File Conventions
9. Testing & Quality Requirements
10. Documentation & ADRs
11. Style, Linting & Formatting
12. Dependencies & Technology Decisions
13. Security & Vulnerability Reporting
14. Release & Versioning (Future)
15. Contributor Resources

---
## 1. Principles & Project Scope
ShareThrift promotes sustainable reuse via a peer‑to‑peer sharing platform. We prioritize:
- Clear business‑aligned domain models (aggregates, entities, value objects)
- Maintainable modular boundaries (bounded contexts)
- Event-driven evolution (domain & future integration events)
- Simplicity first; avoid premature generalization

---
## 2. Code of Conduct
We follow the spirit of the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) (add a dedicated CODE_OF_CONDUCT.md if not already present).

Summary:
- Be respectful and inclusive.
- Provide constructive feedback.
- No harassment or discriminatory language.
- Report unacceptable behavior privately to maintainers.

---
## 3. Ways to Contribute
- Report bugs & usability issues
- Propose enhancements (features, performance, observability, tooling)
- Improve domain model clarity & documentation
- Add tests (unit, integration, scenario/feature)
- Write or refine ADRs for architectural decisions
- Improve developer experience (scripts, tasks)

---
## 4. Issue Creation Workflow (Manual & Copilot)
### Manual Issue
1. Click “New Issue” in the repository.
2. Use a clear title: `listing: implement pause/resume state machine`.
3. Provide context: business rationale, acceptance criteria, links to BRD/SRD or ADRs.
4. Add labels: `domain`, `ui`, `tech-debt`, `documentation`, etc.
5. (Optional) Assign yourself or another contributor.

### Copilot-Assisted Issue
If you want the GitHub Copilot coding agent to implement the task:
1. Create the issue normally (as above).
2. Include the trigger hashtag `#github-pull-request_copilot-coding-agent` in the issue body.
3. Provide exact scope: files to modify, constraints, test expectations.
4. Assign the issue to **GitHub Copilot** (or the bot account used in this repo) and add a `copilot` label if available.
5. Avoid ambiguity: break large changes into smaller issues.

Copilot will attempt to open a Pull Request automatically. Monitor its progress, review the PR thoroughly, and request adjustments as needed.

---
## 5. Assigning Work to GitHub Copilot Coding Agent
In the issue body:
```
#github-pull-request_copilot-coding-agent
Goal: Implement reservation cancellation invariant checks.
Constraints:
- Modify only reservation aggregate & related value objects.
- Add unit tests (Vitest) + feature file.
- Update ADR if aggregate lifecycle changes.
```
Then assign to the Copilot user. The agent will create a branch and PR (example: `copilot/issue-XYZ`).

---
## 6. Pull Request Process & Review Guidelines
1. Branch from `main` using a descriptive name: `feature/listing-lifecycle`, `fix/messaging-timeout`.
2. Keep PRs focused; avoid mixing refactors with new features.
3. Ensure build succeeds: `npm run build` (or `pnpm run build` if using pnpm).
4. Ensure tests pass: `npm test` and maintain coverage.
5. Run lint/format: `npm run lint` (Biome).
6. Update or add ADRs for architectural changes.
7. Provide PR description:
   - Problem statement
   - Solution summary
   - Affected domain concepts
   - Testing evidence (screenshots/logs if UI/telemetry)
8. Request review from domain owners / maintainers.
9. Address comments promptly and explain trade‑offs when declining suggestions.
10. Squash commits if noisy or fixup commits exist; maintain clear history.

### Reviewers Check:
- Domain invariants upheld
- No leakage of infrastructure into domain layer
- Proper file naming & exports
- Adequate test coverage & meaningful assertions
- No unexplained new dependencies

---
## 7. Architectural & Domain Standards (DDD)
Follow structure under `packages/sthrift/domain/src/domain/contexts/`:
- Aggregates (`*.aggregate.ts`): consistency boundary & business rules
- Entities (`*.entity.ts`): identity + behavior within aggregate
- Value Objects (`*.value-objects.ts`): immutable validated types
- Repositories (`*.repository.ts`): interface only (no persistence logic here)
- Unit of Work (`*.uow.ts`): orchestrates atomic persistence + event emission plan
- Passports & Visas: authorization models per bounded context

Always use ubiquitous language from BRD/SRD. If introducing new concepts, update the context README + possibly an ADR.

---
## 8. Naming & File Conventions
- Kebab-case for file & folder names: `listing-reservation.aggregate.ts`
- Aggregate root file ends with `.aggregate.ts`
- Entity file ends with `.entity.ts`
- Co-located value objects: `{aggregate|entity}.value-objects.ts`
- Use `index.ts` at context and aggregate directories to re-export public APIs
- Avoid one-letter variable names; prefer intention-revealing naming

---
## 9. Testing & Quality Requirements
- Every aggregate, entity, value object: unit tests + scenario (`.feature`) files
- Use Vitest for tests; avoid broad integration unless required
- Test naming: describe business rule (e.g., `should_reject_reservation_if_period_overlaps`)
- Assert domain invariants explicitly (not just property presence)
- Maintain or improve coverage; do not submit PRs that reduce quality gates

Example commands:
```bash
npm test
npm run lint
```

---
## 10. Documentation & ADRs
- Significant architectural shifts require an ADR (`documents/` folder)
- Reference existing ADRs (DDD, telemetry, infra) when building upon patterns
- Update README sections affected by change (Architecture, Roadmap, etc.)
- Add context README if new bounded context introduced

ADR Template includes:
- Context & Problem
- Decision
- Consequences (positive/negative)
- Alternatives considered

---
## 11. Style, Linting & Formatting
- TypeScript strict mode enforced
- Biome provides lint + format
- Prefer composition over inheritance
- Use `readonly` where immutability intended
- Provide JSDoc for public APIs & complex domain logic

---
## 12. Dependencies & Technology Decisions
- Before adding a new dependency: evaluate footprint, security posture, maintenance status
- For domain logic: avoid infrastructure libraries directly
- Add dependency rationale in PR description or ADR if impactful

---
## 13. Security & Vulnerability Reporting
- Do not include secrets in code or commits
- Planned integration: Azure Key Vault & secret scanning
- Report vulnerabilities privately to maintainers (add email/contact once available)
- Follow principle of least privilege in service registration and IAM constructs

---
## 14. Release & Versioning (Future)
- Pending formal semantic versioning for public packages
- For now, changes merged to `main` will be part of the next deployment

---
## 15. Contributor Resources
- README (architecture, roadmap)
- BRD/SRD: business and system requirements (`documents/`)
- ADRs: architectural decision history
- Domain Instructions: `.github/instructions/*` and per-context READMEs
- Tooling: VS Code tasks (`func: host start`, watch builds)
- Observability: OpenTelemetry spans (extend as needed)

---
## Quick Reference Checklist (PR Author)
- [ ] Domain classes follow naming conventions
- [ ] No infra code inside domain layer
- [ ] Tests added & passing; coverage acceptable
- [ ] Lint & format clean
- [ ] ADR added/updated (if needed)
- [ ] README / context docs updated (if needed)
- [ ] Issue references included

---
## Acknowledgements
Inspired by circular economy platforms and sustainable design principles. Thank you for helping build a responsible sharing ecosystem.

---
## License
By contributing, you agree that your contributions will be licensed under the project’s MIT License.

---
Happy contributing! If anything is unclear, open an issue labeled `question` or start a discussion.
