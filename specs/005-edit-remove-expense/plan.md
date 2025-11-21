# Implementation Plan: Edit and Remove Expense Records

**Branch**: `005-edit-remove-expense` | **Date**: 2025-11-21 | **Spec**: [specs/005-edit-remove-expense/spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-edit-remove-expense/spec.md`

## Summary
Implement **Edit** and **Delete** functionality for expenses. This involves updating the global state reducer to handle `DELETE` and `UPDATE` actions, refactoring the `AddExpense` view to support editing mode, and adding action buttons to the `ExpenseList` component.

## Technical Context

**Language/Version**: JavaScript (ES6+) / React 18+
**Primary Dependencies**: `@picocss/pico` (UI), Native React Hooks (State)
**Storage**: `localStorage` (Existing persistence layer)
**Testing**: `node:test` for reducer logic
**Target Platform**: Modern Web Browsers
**Project Type**: Single Page Application (Vite)
**Constraints**: No external router; State-based navigation.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Code Quality**: Standard JS/ES6+.
- [x] **Testing**: Reducer logic (Delete/Update) will be tested with `node:test`.
- [x] **UX**: Uses Pico.css; Reuses existing form for consistency.
- [x] **Storage**: Updates existing localStorage.
- [x] **Component-Driven**: Refactors `AddExpense` to be reusable `ExpenseForm`.
- [x] **Tech Stack**: Pure React state, no router.

## Project Structure

### Documentation (this feature)

```text
specs/005-edit-remove-expense/
├── plan.md              # This file
├── research.md          # Strategy & Decisions
├── data-model.md        # State transformations
├── quickstart.md        # User guide / verification steps
├── contracts/           # Reducer action definitions
└── tasks.md             # Task breakdown
```

### Source Code

```text
src/
├── context/
│   └── expenseReducer.js      # Update: Add DELETE/UPDATE/EDIT handlers
├── components/
│   ├── ExpenseList.jsx        # Update: Add Edit/Delete buttons
│   └── ExpenseForm.jsx        # Refactor: Renamed from AddExpense (or new shared comp)
├── views/
│   ├── AddExpense.jsx         # Update: Wrapper using ExpenseForm
│   ├── EditExpense.jsx        # New: Wrapper using ExpenseForm with pre-fill
│   └── Dashboard.jsx          # Update: Pass actions to List
└── App.jsx                    # Update: Handle 'edit-expense' view
tests/
└── logic/
    └── expenseReducer.test.js # Update: Test new reducer actions
```

**Structure Decision**: Single project structure. Refactoring existing view to allow code reuse.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
