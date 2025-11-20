# Tasks: Personal Expense Tracker

**Feature**: `002-expense-tracker`
**Status**: Pending
**Spec**: [specs/002-expense-tracker/spec.md](spec.md)

## Phase 1: Setup & Infrastructure

*Goal: Initialize project structure and install dependencies.*

- [x] T001 Install core dependencies (lucide-react, date-fns, clsx, tailwind-merge)
- [x] T002 Initialize shadcn-ui and install base components (button, input, label, select, dialog, card, table)
- [x] T003 Install and configure testing dependencies (vitest, @testing-library/react, jsdom)
- [x] T004 Create project directory structure (components/dashboard, components/expense, hooks, lib, tests)

## Phase 2: Foundation

*Goal: Implement core data types and storage mechanism with TDD.*

- [x] T005 Create domain types in `src/lib/types.ts` (Expense interface, Category enum)
- [x] T006 Create unit tests for utility functions in `src/lib/__tests__/utils.test.ts`
- [x] T007 Implement utility functions in `src/lib/utils.ts` (currencyFormatter, dateFormatter)
- [x] T008 Create unit tests for useLocalStorage hook in `src/hooks/__tests__/use-local-storage.test.ts`
- [x] T009 Implement `useLocalStorage` hook in `src/hooks/use-local-storage.ts`
- [x] T010 [P] Create unit tests for Storage Service in `src/services/__tests__/storage.test.ts`
- [x] T011 [P] Implement Storage Service wrapper in `src/services/storage.ts`

## Phase 3: User Story 1 - Add New Expense

*Goal: Allow users to record expenses.*
*Priority: P1*

- [x] T012 [US1] Create component tests for AddExpenseForm in `src/components/expense/__tests__/add-expense-form.test.tsx`
- [x] T013 [US1] Create AddExpenseForm component in `src/components/expense/add-expense-form.tsx` (UI skeleton)
- [x] T014 [US1] Implement validation and submission logic in `src/components/expense/add-expense-form.tsx` to pass tests
- [x] T015 [US1] Create ExpenseDialog wrapper in `src/components/expense/expense-dialog.tsx`
- [x] T016 [US1] Add "Add Expense" trigger button to `src/App.tsx` layout

## Phase 4: User Story 2 - View Dashboard

*Goal: Display recent activity and category summaries.*
*Priority: P1*

- [x] T017 [US2] Create unit tests for analytics logic in `src/lib/__tests__/analytics.test.ts`
- [x] T018 [US2] Implement data aggregation logic in `src/lib/analytics.ts`
- [ ] T019 [P] [US2] Create component tests for RecentExpensesList in `src/components/dashboard/__tests__/recent-expenses-list.test.tsx`
- [ ] T020 [P] [US2] Create RecentExpensesList component in `src/components/dashboard/recent-expenses-list.tsx`
- [ ] T021 [P] [US2] Create component tests for CategorySummary in `src/components/dashboard/__tests__/category-summary.test.tsx`
- [ ] T022 [P] [US2] Create CategorySummary component in `src/components/dashboard/category-summary.tsx`
- [ ] T023 [US2] Assemble Dashboard view in `src/components/dashboard/dashboard-view.tsx`
- [ ] T024 [US2] Implement Empty State in `src/components/dashboard/empty-state.tsx`

## Phase 5: Polish & Cross-Cutting

*Goal: Ensure robustness and UX quality.*

- [ ] T025 Implement error handling for LocalStorage quota in `src/services/storage.ts`
- [ ] T026 Verify responsive layout on mobile (320px)
- [ ] T027 Final manual verification of Constitution Principles (Strict Mode, Accessibility)

## Dependencies

1. **Phase 1 & 2** (Setup/Foundation) must complete first.
2. **T005** (Types) is required for all tests.
3. **T012** (Form Tests) must exist before T014 (Form Logic).
4. **T017** (Analytics Tests) must exist before T018 (Analytics Logic).

## Implementation Strategy

- **TDD Approach**: Write the test task first (e.g., T006), watch it fail (or stub it), then write the implementation (T007) to make it pass.
- **MVP Scope**: Complete Phases 1-3 to enable data entry.
