---
description: "Task list for implementing the Expense Category Visualization using Recharts"
---

# Tasks: Expense Category Visualization

**Input**: Design documents from `/specs/004-expense-pie-chart/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are OPTIONAL but required for Logic/Utils (TDD) per Constitution. UI tests are optional.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: User Story ID (e.g., US1)
- Paths are relative to project root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install `recharts` dependency
- [x] T002 [P] Define color palette constants in `src/utils/constants.js` (or similar shared location)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic that must be ready before UI integration

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create test file `tests/logic/expenseUtils.test.js` for aggregation logic
- [x] T004 Implement unit tests for `aggregateExpensesByCategory` in `tests/logic/expenseUtils.test.js` (Red phase)
- [x] T005 Implement `aggregateExpensesByCategory` in `src/utils/expenseUtils.js` to pass tests (Green phase)

**Checkpoint**: Aggregation logic is tested and ready for use by UI components.

---

## Phase 3: User Story 1 - View Expense Breakdown (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to view a pie chart of my expenses by category on the dashboard.

**Independent Test**: Add expenses in different categories, verify chart renders correct proportions and details.

### Implementation for User Story 1

- [x] T006 [US1] Create `src/components/ExpensePieChart.jsx` skeleton component
- [x] T007 [US1] Implement `ExpensePieChart` rendering using Recharts `PieChart`, `Pie`, `Cell`
- [x] T008 [US1] Add `Tooltip` and `Legend` (responsive) to `ExpensePieChart`
- [x] T009 [US1] Handle empty state ("No data") within `ExpensePieChart`
- [x] T010 [US1] Integrate `ExpensePieChart` into `src/App.jsx` (or Dashboard component) above the list
- [x] T011 [US1] Wire up real expense data from `App.jsx` state to `ExpensePieChart` via aggregation utility

**Checkpoint**: User Story 1 should be fully functional. The dashboard now shows the chart.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T012 [P] Verify responsiveness on mobile viewport (Legend stacking)
- [x] T013 Check for console errors during interaction (hover/tap)
- [x] T014 Ensure distinct colors for all 6 fixed categories
- [x] T015 Update documentation if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS UI work.
- **User Story 1 (Phase 3)**: Depends on Foundational aggregation logic.

### Parallel Opportunities

- T001 and T002 can be done in parallel.
- T006 (Component skeleton) can start while T005 (Utils) is being finalized, but T010 (Integration) requires both.

## Implementation Strategy

### MVP Delivery

1.  Install Recharts.
2.  Implement and test aggregation logic (TDD).
3.  Build the Chart component.
4.  Place it on the Dashboard.
5.  Verify with manual test (add expense -> check chart).

