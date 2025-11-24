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
5. Assign yourself, copilot, or another contributor.

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
    - Links (BRD/SRD/ADRs if applicable)
6. Edit the generated issue if needed (DO NOT skip reviewing).
7. Add labels: `domain`, `ui`, `tech-debt`, `documentation`, etc.
8. Assign yourself, copilot, or another contributor.

<img src="./readme-assets/github_create_task.png" width="500" alt="github_create_task">
<img src="./readme-assets/github_create_task_2.png" width="500" alt="github_create_task_2">
<img src="./readme-assets/github_create_task_3.png" width="500" alt="github_create_task_3">

Copilot will attempt to open a Pull Request automatically. Monitor its progress, review the PR thoroughly, and request adjustments as needed.

If task assigned to the Copilot user. The agent will create a branch and PR (example: `copilot/issue-XYZ`).


