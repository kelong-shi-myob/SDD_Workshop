# Tasks: Personal Expense Tracker

**Input**: Design documents from `/specs/003-expense-tracker/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Optional `node:test` unit tests for logic/utils only (per Constitution).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Source**: `src/`
- **Tests**: `tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure (src/components, src/context, src/hooks, src/utils, src/views)
- [ ] T002 Initialize React project with Vite and install Pico.css
- [ ] T003 [P] Configure `jsconfig.json` for absolute imports (if needed)
- [ ] T004 [P] Create `src/main.jsx` and `src/index.css` with Pico.css import

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create `src/utils/uuid.js` for ID generation
- [ ] T006 [P] Create `src/utils/constants.js` with fixed CATEGORIES list
- [ ] T007 [P] Implement `useLocalStorage` hook in `src/hooks/useLocalStorage.js`
- [ ] T008 Create `src/context/ExpenseContext.jsx` with initial state and empty reducer
- [ ] T009 Create `src/App.jsx` shell with basic layout (header/main container)
- [ ] T010 [P] Create `tests/logic/test_constants.js` to verify category list integrity

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Expense (Priority: P1) 🎯 MVP

**Goal**: Users can record new expenses (Amount, Date, Category, Description) which persist to local storage.

**Independent Test**: Fill out the form, save, and verify data appears in `localStorage`.

### Tests for User Story 1 (Logic/Utils)

- [ ] T011 [P] [US1] Create `tests/logic/test_reducer_add.js` to test ADD_EXPENSE action
- [ ] T012 [P] [US1] Create `tests/logic/test_validation.js` for expense input validation

### Implementation for User Story 1

- [ ] T013 [US1] Implement `ADD_EXPENSE` action in `src/context/ExpenseContext.jsx` reducer
- [ ] T014 [US1] Create `src/views/AddExpense.jsx` view component shell
- [ ] T015 [US1] Implement form state and validation in `src/views/AddExpense.jsx`
- [ ] T016 [US1] Connect `AddExpense` form to Context `addExpense` function
- [ ] T017 [US1] Update `src/App.jsx` to conditionally render `AddExpense` view
- [ ] T018 [P] [US1] Create `src/components/Notification.jsx` for success/error feedback

**Checkpoint**: User can add expenses. Data is saved. Form validates input.

---

## Phase 4: User Story 2 - View Recent Expenses (Priority: P1)

**Goal**: Users see the 10 most recent expenses on the dashboard.

**Independent Test**: Add 11+ expenses, verify dashboard shows only top 10 sorted by date.

### Tests for User Story 2 (Logic/Utils)

- [ ] T019 [P] [US2] Create `tests/logic/test_sorting.js` to verify date sorting logic

### Implementation for User Story 2

- [ ] T020 [US2] Create `src/utils/format.js` for currency and date formatting
- [ ] T021 [US2] Create `src/components/ExpenseList.jsx` component to display list
- [ ] T022 [US2] Implement sorting and slicing logic (top 10) in `src/views/Dashboard.jsx`
- [ ] T023 [US2] Create `src/views/Dashboard.jsx` to compose ExpenseList
- [ ] T024 [US2] Update `src/App.jsx` to set 'dashboard' as default view and render it

**Checkpoint**: Dashboard works. Recent expenses are visible.

---

## Phase 5: User Story 3 - View Category Summary (Priority: P2)

**Goal**: Users see total spend per category.

**Independent Test**: Add expenses in different categories, verify totals match sum.

### Tests for User Story 3 (Logic/Utils)

- [ ] T025 [P] [US3] Create `tests/logic/test_calculations.js` for category summation

### Implementation for User Story 3

- [ ] T026 [US3] Implement `calculateCategoryTotals` function in `src/utils/calculations.js`
- [ ] T027 [US3] Create `src/components/CategorySummary.jsx` component
- [ ] T028 [US3] Add `CategorySummary` to `src/views/Dashboard.jsx`
- [ ] T029 [US3] Style summary table/cards using Pico.css grid

**Checkpoint**: Category totals are visible on the dashboard.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T030 [P] Add "No expenses yet" empty state to Dashboard
- [ ] T031 [P] Add navigation buttons (Home/Add) to Header in `src/App.jsx`
- [ ] T032 Refactor `useExpenses` hook to expose only necessary actions
- [ ] T033 Verify 100% pass rate for `npm test`
- [ ] T034 Run quickstart manual validation steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Blocks all stories.
- **User Story 1 (P1)**: Unlocks data entry.
- **User Story 2 (P1)**: Depends on US1 data (conceptually), but can use mock data for dev.
- **User Story 3 (P2)**: Depends on US2 dashboard structure.

### User Story Dependencies

- **US1 (Add)**: Critical path. Must exist to generate data.
- **US2 (List)**: Can be built with hardcoded data, but needs US1 for end-to-end flow.
- **US3 (Summary)**: Enhances US2.

### Parallel Opportunities

- T003/T004/T006/T007/T010 (Setup/Foundation)
- T011/T012 (US1 Tests) vs T013 (US1 Impl)
- T020 (Formatting) vs T021 (UI Component)
- T025 (Logic Test) vs T027 (UI Component)

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phases 1 & 2 (Foundation)
2. Complete Phase 3 (Add Expense) -> **Test**: Can I save data?
3. Complete Phase 4 (View Recent) -> **Test**: Can I see my data?
4. **MVP Complete**

### Incremental Delivery

1. **Increment 1**: App shell + Add Expense Form (US1)
2. **Increment 2**: Dashboard List (US2)
3. **Increment 3**: Category Totals (US3)

