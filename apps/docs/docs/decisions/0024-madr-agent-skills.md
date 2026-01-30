---
sidebar_position: 24
sidebar_label: 0024 Agent Skills Integration
description: "Decision record for integrating Agent Skills to enhance AI-assisted development with domain-specific context."
status: accepted
contact: jasonmorais
date: 2026-01-30
deciders: jasonmorais
consulted: patrick gidich
informed: cxa-team
---

# Integrate Agent Skills for AI-Assisted Development

## Context and Rationale

AI coding assistants like GitHub Copilot provide general programming assistance but lack project-specific architectural context and patterns. As the ShareThrift project grows in complexity with DDD architecture, microservices patterns, event sourcing, CQRS, and enterprise patterns, AI agents need deeper understanding of:

1. **Project-specific patterns**: Our DDD tactical patterns (aggregates, entities, value objects, repositories, unit of work)
2. **Technology-specific best practices**: Apollo GraphQL, Turborepo, React 19 patterns, Azure Functions
3. **Architectural constraints**: Bounded contexts, consistency boundaries, saga patterns, API gateway patterns
4. **Framework conventions**: Naming conventions, file structures, testing patterns
5. **Enterprise patterns**: Event sourcing, CQRS, circuit breakers, resilience patterns

Agent Skills provide structured, discoverable context in a standardized format that AI agents can consume effectively. The Skills CLI enables easy installation, updating, and management of both community-maintained and custom skills.

### New Skills Installation Guide

#### 1. **Skills CLI Integration**

**Installation and Management**:
```bash
# Install skills via pnpm (preferred over npx)
pnpm dlx skills add <repository> --skill <skill-name>

# List installed skills
pnpm dlx skills list

# Update all skills to latest versions
pnpm dlx skills update

# Remove a skill
pnpm dlx skills remove <skill-name>
```

When given options, select symlink, project wide for the installation, and github copilot and the only agent.

#### 2. **Installed Skills**

**Technology-Specific Skills** (from public repositories):

1. **apollo-client** (from `apollographql/skills`)
   - Apollo Client 4.x best practices
   - Cache configuration and optimization
   - Suspense hooks and modern React patterns
   - Data masking and component boundaries
   - Source: Apollo GraphQL official skills

2. **apollo-server** (from `apollographql/skills`)
   - Apollo Server 4.x patterns
   - DataLoader for N+1 query prevention
   - Error handling and logging standards
   - Context management and authentication
   - Source: Apollo GraphQL official skills

3. **graphql-operations** (from `apollographql/skills`)
   - GraphQL query/mutation best practices
   - Fragment composition
   - Operation naming conventions
   - Source: Apollo GraphQL official skills

4. **graphql-schema** (from `apollographql/skills`)
   - GraphQL schema design patterns
   - Type system best practices
   - Schema federation (if applicable)
   - Source: Apollo GraphQL official skills

5. **turborepo** (from `vercel/turborepo`)
   - Turborepo task orchestration
   - Caching strategies
   - Pipeline dependencies
   - Workspace configuration
   - Source: Vercel/Turborepo official skills

6. **vercel-react-best-practices** (from `vercel-labs/agent-skills`)
   - React 19 patterns and best practices
   - Performance optimization
   - Component composition
   - Hook patterns
   - Source: Vercel official skills

**Enterprise Architecture Skills** (from specialized repositories):

7. **enterprise-architecture-patterns** (from `manutej/luxor-claude-marketplace`)
   - Domain-Driven Design (Strategic & Tactical patterns)
   - Event Sourcing with snapshots
   - CQRS (Command Query Responsibility Segregation)
   - Saga Pattern (Orchestration & Choreography)
   - API Gateway & Backend-for-Frontend (BFF) patterns
   - Service Mesh configuration
   - Resilience Patterns (Circuit Breaker, Retry, Bulkhead)
   - Distributed systems design
   - Source: Community-maintained enterprise patterns skill (2457 lines)

**Skill File Format**:
Each skill contains a `SKILL.md` file with:
- **Metadata header**: Name, description, tags, tier
- **When to use**: Contextual guidance for AI agents
- **Patterns and examples**: Concrete code examples
- **Best practices**: Dos and don'ts
- **Common pitfalls**: Anti-patterns to avoid

#### 3. **Skills Update Workflow**

**Limitation**: The `pnpm dlx skills update` command has limitations:
- Updates **modified files** in skills
- Does **NOT restore deleted files**
- Performs diff/comparison, not full restoration

**To restore corrupted skills**:
```bash
# Remove and reinstall
pnpm dlx skills remove <skill-name>
pnpm dlx skills add <repository> --skill <skill-name>
```

**Update cadence**:
- Run `pnpm dlx skills update` weekly or when skills repositories announce updates
- Review skill changes before committing updates
- Test AI agent behavior after major skill updates

#### 6. **Custom Skills (Future)**

For ShareThrift-specific patterns not available in public repositories:
- Domain models for ShareThrift business logic
- Cellix framework patterns and conventions
- Azure Functions + DDD integration patterns
- Custom bounded context structures

**Creating custom skills**:
```bash
# Add custom skill from ShareThrift repository
pnpm dlx skills add simnova/sharethrift --skill sharethrift-domain-patterns
```

## Benefits and Outcomes

- **Enhanced AI understanding**: AI agents have deep context about DDD, CQRS, event sourcing, and enterprise patterns
- **Pattern consistency**: AI-generated code follows established architectural patterns
- **Technology expertise**: AI agents understand Apollo GraphQL, Turborepo, React 19 best practices
- **Reduced anti-patterns**: AI agents avoid common pitfalls (N+1 queries, cache anti-patterns, Turborepo bypasses)
- **Faster development**: AI agents suggest solutions aligned with project architecture
- **Knowledge sharing**: Skills serve as living documentation for both AI and human developers
- **Community leverage**: Benefit from Apollo, Vercel, and community-maintained skills
- **Easy management**: Skills CLI simplifies installation and updates
- **Version control**: Skills tracked in git alongside code
- **CI/CD consistency**: Same skills available locally and in pipelines

## Validation

### Local Development Validation
- AI agents reference skills when suggesting code changes
- Code suggestions align with DDD patterns, Apollo best practices, and Turborepo conventions
- AI agents identify anti-patterns (N+1 queries, prebuild scripts, manual cache updates)
- Skills content is visible when asking AI agents about architectural patterns



## More Information

### Installed Skills Sources

1. **Apollo Skills**: https://github.com/apollographql/skills
   - apollo-client, apollo-server, graphql-operations, graphql-schema

2. **Turborepo Skills**: https://github.com/vercel/turborepo
   - turborepo

3. **Vercel Skills**: https://github.com/vercel-labs/agent-skills
   - vercel-react-best-practices

4. **Enterprise Architecture Skills**: https://github.com/manutej/luxor-claude-marketplace
   - enterprise-architecture-patterns (comprehensive DDD, CQRS, Saga, Event Sourcing guide)

### Skills CLI Documentation

- **Skills CLI GitHub**: https://github.com/skills-sh/skills
- **Skills Format**: Skills are markdown files with YAML frontmatter
- **Installation**: Via npx or pnpm dlx (pnpm dlx preferred for this project)

### Usage Examples

**Installing a skill**:
```bash
pnpm dlx skills add apollographql/skills --skill apollo-client
```

**Viewing installed skills**:
```bash
pnpm dlx skills list
```

**Updating all skills**:
```bash
pnpm dlx skills update
```

**Removing a skill**:
```bash
pnpm dlx skills remove apollo-client
```

### Future Considerations

- **Custom ShareThrift skills**: Create custom skills for domain-specific patterns:
  - ShareThrift bounded contexts (Listings, Reservations, Members, IAM)
  - Cellix framework conventions
  - Azure Functions + DDD integration patterns

- **Lock file consideration**: Monitor Skills CLI for lock file feature (similar to package-lock.json)
  - Would enable reproducible AI context across environments
  - Currently not supported by Skills CLI

### Related Documents
- **0003-domain-driven-design.md**: DDD patterns that enterprise-architecture-patterns skill reinforces
- **0001-madr-architecture-decisions.md**: Decision documentation process this ADR follows

### Key Implementation Files
- `.agents/skills/`: All installed skills directory
