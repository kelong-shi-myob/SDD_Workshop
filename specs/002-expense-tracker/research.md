# Research: Personal Expense Tracker

**Feature**: `002-expense-tracker`
**Date**: 2025-11-20

## Decisions

### UI Component Strategy
- **Decision**: Use a **Dialog (Modal)** for the "Add Expense" form instead of a separate route.
- **Rationale**: Keeps the user context on the Dashboard. Fits the "Quick Add" user story better than navigating away. Matches the "Single Page" feel of a simple tracker.
- **Constitution Check**: Aligned with shadcn/ui usage (Dialog component).

### Storage Key Namespace
- **Decision**: Use prefix `sdd_workshop_expense_tracker_v1_`.
- **Rationale**: Constitution Principle IV requires namespacing. `v1` allows for future schema migrations if needed.
- **Alternatives Considered**: Just `expenses`. Rejected to avoid collision with other apps running on localhost or similar domains.

### Date Handling
- **Decision**: Store dates as ISO strings (`YYYY-MM-DD`) in JSON.
- **Rationale**: Simple to sort strings. Easy to parse back to Date objects for display.
- **Alternatives Considered**: Timestamp (number). ISO string is more human-readable in LocalStorage inspection (easier debugging).

