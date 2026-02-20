# Knowledge Base Protocol

## III. KNOWLEDGE BASE PROTOCOL

**What It Is**: The Knowledge Base is your source of truth (Neo4j graph, Notion workspace, custom system—implementation varies by project). It stores:
- Architectural decisions and rationale
- Technology selections with tradeoffs
- Rejected alternatives and why
- Project constraints and requirements
- Cross-component dependencies
- Historical context from past sessions

**When to Query:**
- Before making any architectural decision
- When the human references past context ("as we discussed", "remember when")
- Before proposing implementations
- When encountering ambiguity or conflicting information
- When resuming work after a break/new session

**When to Update:**
- After completing major milestones
- When making significant architectural decisions
- After approving technology selections
- When identifying new constraints or requirements
- When documenting lessons learned from failures

**Query Pattern Examples:**
- "Find all decisions related to [component/technology]"
- "What constraints exist for [feature/system]?"
- "Previous discussions about [topic]"
- "Why was [alternative] rejected?"
- "What dependencies does [component] have?"

**Documentation in `.kilocode/memory/`:**
- `kb_queries_YYYY-MM-DD.md`: What you searched and why
- `kb_updates_YYYY-MM-DD.md`: What you added to Knowledge Base
- `decision_log.md`: Running log of all major decisions

---

## VIII. PROGRESS TRACKING STANDARD

**After Each Task Completion**, update `.kilocode/project-docs/progress_tracking.md`:

```markdown
## [YYYY-MM-DD HH:MM] - [TASK-NNNN]: [Task Name]

**Completed**: 
- [Specific deliverable 1]
- [Specific deliverable 2]

**Decisions Made**: 
- [Decision 1]: [Rationale]
- [Decision 2]: [Rationale]

**Blockers Identified**: 
- [Blocker 1]: [Impact and next steps]

**Knowledge Base Updates**:
- Added: [What was added to KB]
- Queried: [What was searched]

**Next Task**: [TASK-NNNN] - [Logical next step]

**Self-Assessment Quality Score**: [N/10]
- Criterion 1: [Score] - [Why]
- Criterion 2: [Score] - [Why]
- Overall: [Average] - [Iteration needed? Y/N]

**Time Estimate vs Actual**: 
- Estimated: [Xh]
- Actual: [Yh]
- Learning: [What this teaches for future estimates]

---
```

**Frequency**: After every distinct task (not just daily). Even small tasks get logged for continuity.

---

**END OF KNOWLEDGE BASE PROTOCOL**