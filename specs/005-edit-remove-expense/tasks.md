---
description: "Task list for implementing Edit and Remove Expense Records functionality"
---

# Tasks: Edit and Remove Expense Records

**Input**: Design documents from `/specs/005-edit-remove-expense/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Logic tests (Reducer) REQUIRED. UI tests OPTIONAL.

**Organization**: Tasks grouped by User Story to enable independent delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: User Story ID (e.g., US1)
- Paths are relative to project root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Update core state management to support CRUD operations.

- [x] T001 [P] Create test file `tests/logic/expenseReducer.test.js` if not exists
- [x] T002 Implement tests for `DELETE_EXPENSE` action in `tests/logic/expenseReducer.test.js` (Red phase)
- [x] T003 Implement tests for `UPDATE_EXPENSE` action in `tests/logic/expenseReducer.test.js` (Red phase)
- [x] T004 Implement `DELETE_EXPENSE` and `UPDATE_EXPENSE` in `src/context/expenseReducer.js` (Green phase)
- [x] T005 Update `SET_VIEW` action in reducer to handle optional `data` (e.g. `expenseId`) payload

**Checkpoint**: Reducer handles delete/update logic correctly and passes tests.

---

## Phase 2: User Story 1 - Remove Expense (Priority: P1)

**Goal**: Allow users to delete expenses from the list.

**Independent Test**: Add expense -> Click Delete -> Verify removed from list & totals update.

### Implementation for User Story 1

- [x] T006 [US1] Update `src/components/ExpenseList.jsx` to include a "Delete" button for each row
- [x] T007 [US1] Wire "Delete" button to dispatch `DELETE_EXPENSE` action
- [x] T008 [US1] Verify deletion updates Dashboard (List, Totals, Chart) automatically (due to Context)

**Checkpoint**: Deletion works and reflects immediately in the UI.

---

## Phase 3: User Story 2 - Edit Expense (Priority: P2)

**Goal**: Allow users to edit existing expenses via the form.

**Independent Test**: Click Edit -> Change Amount -> Save -> Verify updated value in Dashboard.

### Implementation for User Story 2

- [x] T009 [US2] Refactor `src/views/AddExpense.jsx` to `src/views/ExpenseForm.jsx` (preserving Add logic)
- [x] T010 [US2] Update `ExpenseForm.jsx` to accept `initialData` or `editId` prop/context
- [x] T011 [US2] Update `ExpenseForm.jsx` to handle "Save" (Update) vs "Add" logic based on mode
- [x] T012 [US2] Update `src/App.jsx` (or main router) to render `ExpenseForm` for both `add-expense` and `edit-expense` views
- [x] T013 [US2] Update `src/components/ExpenseList.jsx` to include "Edit" button dispatching `SET_VIEW` with ID
- [x] T014 [US2] Handle "Cancel" button in `ExpenseForm` to return to Dashboard without saving

**Checkpoint**: Editing works, data is pre-filled, and updates persist.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and UX improvements.

- [x] T015 [P] Ensure "Add" mode still works correctly (Regression test)
- [x] T016 Remove old `AddExpense.jsx` file if fully replaced/renamed
- [x] T017 Verify Chart updates correctly after Edit/Delete operations
- [x] T018 Update documentation/comments

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Reducer)**: BLOCKS everything.
- **Phase 2 (Delete)**: Can start after Phase 1.
- **Phase 3 (Edit)**: Can start after Phase 1 (Refactoring `AddExpense` can happen in parallel with Delete UI work).

### Parallel Opportunities

- T002 and T003 (Tests) can be written in parallel.
- T006 (Delete UI) and T009 (Form Refactor) can be done in parallel after Phase 1.

## Implementation Strategy

### Incremental Delivery

1.  **Reducer**: Solidify the logic first (safe, testable).
2.  **Delete**: Low hanging fruit, high value (P1).
3.  **Edit**: Higher complexity (Form handling), do last.

