# Directory Structure Standard

## II. DIRECTORY STRUCTURE STANDARD

All project artifacts live under `.kilocode/`:

```
.kilocode/
├── project-docs/        # Specifications, ADRs, roadmaps, technical docs
├── user-docs/           # End-user guides, API documentation, tutorials
├── memory/              # Knowledge Base exports, decision logs, context snapshots
├── transcripts/         # Session logs: YYYY-MM-DD_HHMM_session-topic.md
├── diagrams/            # Mermaid (preferred), PlantUML, or suitable format
├── testing/             # Test plans, test cases, bug reports, quality metrics
├── reviews/             # Quality assessments, code reviews, architectural audits
└── handoffs/            # Cross-session continuity documents
```

**Enforcement**: Create these directories on project initialization. Reference them in all documentation.

---

## IV. CRITICAL DOCUMENTATION ARTIFACTS

### **Planning Phase** → `.kilocode/project-docs/`

**Required Documents:**
1. **`00_project_specification.md`**
   - Goals and objectives
   - Scope boundaries (what's in/out)
   - Key constraints (time, budget, technical, regulatory)
   - Success criteria
   - Stakeholders and their needs

2. **`01_architecture_decisions/`** (directory)
   - Format: `ADR-NNNN-descriptive-title.md`
   - Structure: Context → Decision → Consequences → Alternatives Considered
   - One ADR per significant decision
   - Cross-reference related ADRs

3. **`02_technology_rationale.md`**
   - Justified technology stack
   - Why each technology was chosen
   - What alternatives were evaluated
   - Tradeoffs accepted
   - Version requirements and compatibility matrix

4. **`03_risk_assessment.md`**
   - Identified risks (technical, operational, security)
   - Likelihood and impact ratings
   - Mitigation strategies
   - Monitoring/detection approaches
   - Contingency plans

5. **`04_implementation_roadmap.md`**
   - Phased breakdown (Phase 1, 2, 3...)
   - Dependencies between phases
   - Time estimates with confidence intervals
   - Resource requirements
   - Milestones and deliverables

### **Design Phase** → `.kilocode/project-docs/` + `.kilocode/diagrams/`

**Required Documents:**
1. **`system_architecture.mmd`** (Mermaid diagram)
   - High-level system components
   - Communication patterns
   - External dependencies
   - Data flow paths
   - Deployment topology

2. **`data_models.md`**
   - Database schemas (all tables/collections)
   - API data contracts
   - Domain models
   - Relationships and constraints
   - Migration strategy

3. **`api_specifications.md`**
   - All endpoints (REST/GraphQL/gRPC)
   - Request/response formats
   - Authentication/authorization
   - Rate limiting and quotas
   - Error handling conventions

4. **`component_interactions.mmd`** (Mermaid sequence diagrams)
   - Service-to-service communication
   - Authentication flows
   - Data synchronization patterns
   - Event-driven interactions

5. **`security_model.md`**
   - Authentication mechanisms
   - Authorization policies
   - Data encryption (at rest, in transit)
   - Secrets management
   - Compliance requirements

### **Implementation Phase** → `.kilocode/project-docs/` + `.kilocode/transcripts/`

**Required Documents:**
1. **`task_breakdown/`** (directory)
   - Format: `TASK-NNNN-descriptive-name.md`
   - Each task: Description, acceptance criteria, dependencies, estimates
   - Granular enough for single work session

2. **`code_review_checklists/`** (directory)
   - Per-language checklists (Python, JavaScript, etc.)
   - Framework-specific items
   - Security review points
   - Performance considerations

3. **`test_coverage_requirements.md`**
   - Coverage targets by layer (unit: 80%, integration: 60%, etc.)
   - Critical paths requiring 100% coverage
   - Testing strategy (TDD, BDD, etc.)
   - Mock/stub guidelines

4. **`progress_tracking.md`**
   - Task completion log (see Section VII for format)
   - Updated after each task
   - Historical record of work done

5. **`blocker_log.md`**
   - Active blockers with severity
   - Dependencies causing delays
   - Decisions needed from stakeholders
   - Workarounds attempted
   - Resolution status

### **Testing Phase** → `.kilocode/testing/`

**Required Documents:**
1. **`test_plan.md`**
   - Testing strategy and scope
   - Resources and timeline
   - Entry/exit criteria
   - Risk-based prioritization

2. **`test_cases/`** (directory)
   - Format: `CASE-NNNN-feature-scenario.md`
   - Preconditions, steps, expected results
   - Test data requirements
   - Automation feasibility

3. **`bug_reports/`** (directory)
   - Format: `BUG-NNNN-short-description.md`
   - Severity, priority, reproduction steps
   - Environment details
   - Screenshots/logs
   - Fix verification criteria

4. **`quality_metrics.md`**
   - Test coverage percentages
   - Performance benchmarks
   - Security scan results
   - Code quality scores
   - Trend analysis

---

**END OF DIRECTORY STRUCTURE STANDARD**