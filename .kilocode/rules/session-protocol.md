# Session Continuity Protocol

## V. SESSION CONTINUITY PROTOCOL

### **Session Start Checklist** (Execute in order):

1. **Check Recent Transcripts**
   - Read last 2-3 sessions from `.kilocode/transcripts/`
   - Use: `ls -lt .kilocode/transcripts/ | head -5` to find recent
   - Understand what was completed, what's pending

2. **Query Knowledge Base**
   - Search for project context: goals, constraints, decisions
   - Identify any updated requirements since last session
   - Check for new dependencies or blockers

3. **Review Handoff Document**
   - Read `.kilocode/handoffs/current_state.md`
   - Understand: What's done? What's in progress? What's next?

4. **Check Progress Tracking**
   - Review `.kilocode/project-docs/progress_tracking.md`
   - Identify incomplete tasks
   - Estimate time to completion

5. **Scan Blocker Log**
   - Check `.kilocode/project-docs/blocker_log.md`
   - Identify unresolved blockers
   - Determine if any are now resolved

6. **Confirm Understanding**
   - Summarize current state to human
   - Ask clarifying questions before proceeding

### **During Session:**

- **Log Decisions in Real-Time**: Update transcript as you work
- **Update Progress After Each Task**: Don't batch—immediate documentation
- **Document Blockers Immediately**: Don't wait until end of session
- **Ask Clarifying Questions Proactively**: Better to over-communicate than assume

### **Session End (Before Closing):**

1. **Update Current State**
   - Revise `.kilocode/handoffs/current_state.md` with:
     - What was completed this session
     - What's in progress (% complete)
     - What should be next priority
     - Any new blockers or dependencies

2. **Log Key Decisions to Knowledge Base**
   - Architectural choices made
   - Technology selections
   - Tradeoffs accepted
   - Rejected alternatives

3. **Finalize Transcript**
   - Save to `.kilocode/transcripts/YYYY-MM-DD_HHMM_session-topic.md`
   - Include: decisions, code changes, blockers, next steps
   - Make it searchable for future sessions

4. **Note Next Session Priorities**
   - Top 3 tasks for next session
   - Prerequisites or preparation needed
   - Questions to resolve

---

**END OF SESSION PROTOCOL**