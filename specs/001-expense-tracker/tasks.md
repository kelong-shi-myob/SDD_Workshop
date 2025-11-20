# Tasks: Personal Expense Tracker

**Input**: Design documents from `/specs/001-expense-tracker/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as per Test-First Development principle (Constitution Principle II). All tests MUST be written and verified to FAIL before implementing the corresponding feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web SPA**: `src/` at repository root
- Components organized by feature area
- Tests co-located with components

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Vite React TypeScript project with `npm create vite@latest . -- --template react-ts`
- [x] T002 Install core dependencies: `npm install react-router-dom react-hook-form zod @hookform/resolvers/zod react-i18next i18next uuid`
- [x] T003 Install UI dependencies: `npx shadcn-ui@latest init` (select Default style, Slate color, CSS variables: Yes)
- [x] T004 [P] Install dev dependencies: `npm install -D @types/uuid vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom happy-dom`
- [x] T005 [P] Configure TypeScript strict mode in `tsconfig.json` (strict: true, noUncheckedIndexedAccess: true)
- [x] T006 [P] Configure Tailwind for dark mode in `tailwind.config.ts` (darkMode: 'class')
- [x] T007 [P] Configure Vitest in `vite.config.ts` (test environment: jsdom, globals: true, setupFiles)
- [x] T008 [P] Setup ESLint + Prettier configurations
- [x] T009 Add shadcn components: `npx shadcn-ui@latest add button card form input label select dialog`
- [x] T010 Create directory structure per plan.md: src/{components,context,hooks,utils,i18n,types}

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Create TypeScript types in `src/types/expense.ts` (ExpenseCategory enum, Expense interface)
- [x] T012 [P] Create TypeScript types in `src/types/preferences.ts` (Theme, Language, UserPreferences)
- [x] T013 [P] Create Zod validation schema in `src/utils/validation.ts` (expenseSchema with all field validations)
- [x] T014 Write unit tests for localStorage adapter in `src/utils/__tests__/localStorage.test.ts`
- [x] T015 Implement localStorage adapter in `src/utils/localStorage.ts` (getExpenses, setExpenses, getPreferences, setPreferences, with QuotaExceededError handling)
- [x] T016 [P] Write unit tests for validation in `src/utils/__tests__/validation.test.ts`
- [x] T017 [P] Write unit tests for formatting in `src/utils/__tests__/formatting.test.ts`
- [x] T018 Implement formatting utilities in `src/utils/formatting.ts` (formatCurrency with locale, formatDate)
- [x] T019 Create custom hook tests in `src/hooks/__tests__/useLocalStorage.test.ts`
- [x] T020 Implement useLocalStorage hook in `src/hooks/useLocalStorage.ts` (generic type-safe localStorage hook)
- [x] T021 [P] Create English translations in `src/i18n/en.json` (all translation keys from data-model.md)
- [x] T022 [P] Create Chinese translations in `src/i18n/zh.json` (all translation keys translated)
- [x] T023 Configure i18next in `src/i18n/translations.ts` (load translations, fallback to 'en')
- [x] T024 Create ThemeContext in `src/context/ThemeContext.tsx` (provider with toggleTheme, persists to localStorage)
- [x] T025 [P] Create LanguageContext in `src/context/LanguageContext.tsx` (provider with setLanguage, integrates with i18next)
- [x] T026 Create AppLayout component in `src/components/Layout/AppLayout.tsx` (header with theme toggle and language selector)
- [x] T027 [P] Create ThemeToggle component in `src/components/Layout/ThemeToggle.tsx` (sun/moon icon button with ARIA label)
- [x] T028 [P] Create LanguageSelector component in `src/components/Layout/LanguageSelector.tsx` (dropdown with English/中文 options)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add New Expense (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new expense records with validation

**Independent Test**: Create an expense with amount: 45.50, date: 2025-11-19, category: Food, description: "Test", verify it persists in localStorage and can be retrieved

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T029 [P] [US1] Write component test for ExpenseForm validation in `src/components/ExpenseForm/__tests__/ExpenseForm.test.tsx` (test: negative amount shows error, future date shows error, empty required fields show errors)
- [x] T030 [P] [US1] Write component test for ExpenseForm submission in `src/components/ExpenseForm/__tests__/ExpenseForm.test.tsx` (test: valid form submits successfully, calls onSubmit with correct data)
- [x] T031 [P] [US1] Write integration test for expense creation in `tests/integration/expense-crud.test.tsx` (test: create expense → persists to localStorage → survives page refresh)

### Implementation for User Story 1

- [x] T032 [P] [US1] Create ExpenseForm component skeleton in `src/components/ExpenseForm/ExpenseForm.tsx` (React Hook Form setup with zodResolver)
- [x] T033 [US1] Implement amount input field in `src/components/ExpenseForm/ExpenseForm.tsx` (number input with validation error display)
- [x] T034 [US1] Implement date input field in `src/components/ExpenseForm/ExpenseForm.tsx` (date picker with max date validation)
- [x] T035 [US1] Implement category select field in `src/components/ExpenseForm/ExpenseForm.tsx` (dropdown with 8 categories from FR-004)
- [x] T036 [US1] Implement description textarea in `src/components/ExpenseForm/ExpenseForm.tsx` (optional field with 200 char limit)
- [x] T037 [US1] Add form submission handler in `src/components/ExpenseForm/ExpenseForm.tsx` (generate id, createdAt, updatedAt, call onSubmit)
- [x] T038 [US1] Create ExpenseContext in `src/context/ExpenseContext.tsx` (provider with addExpense, updateExpense, deleteExpense methods)
- [x] T039 [US1] Implement addExpense method in `src/context/ExpenseContext.tsx` (validate, save to localStorage, update state, trigger storage event)
- [x] T040 [US1] Add error handling in `src/context/ExpenseContext.tsx` (handle QuotaExceededError, show user notification)
- [x] T041 [US1] Integrate ExpenseForm into Dashboard in `src/components/Dashboard/Dashboard.tsx` (add "Add Expense" button that opens dialog with form)
- [x] T042 [US1] Add form validation error messages in `src/components/ExpenseForm/ExpenseForm.tsx` (display translated error messages from i18n)
- [x] T043 [US1] Verify all US1 tests pass and expense creation works end-to-end

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Expenses Dashboard (Priority: P1) 🎯 MVP

**Goal**: Display 10 most recent expenses and category summary sorted by spending

**Independent Test**: Pre-populate localStorage with 15 expenses across 3 categories, verify dashboard shows exactly 10 most recent in reverse chronological order, category totals correct and sorted by amount descending

### Tests for User Story 2 ⚠️

- [ ] T044 [P] [US2] Write component test for Dashboard in `src/components/Dashboard/__tests__/Dashboard.test.tsx` (test: renders empty state when no expenses, renders expense list when expenses exist)
- [ ] T045 [P] [US2] Write component test for ExpenseList in `src/components/ExpenseList/__tests__/ExpenseList.test.tsx` (test: displays max 10 expenses, sorts by date descending)
- [ ] T046 [P] [US2] Write component test for CategorySummary in `src/components/CategorySummary/__tests__/CategorySummary.test.tsx` (test: calculates totals correctly, sorts by amount descending, hides empty categories)
- [ ] T047 [P] [US2] Write unit test for calculateCategorySummaries in `src/utils/__tests__/categorySummary.test.ts` (test: aggregates amounts, counts expenses, sorts correctly)

### Implementation for User Story 2

- [ ] T048 [P] [US2] Create Dashboard component in `src/components/Dashboard/Dashboard.tsx` (main container, uses ExpenseContext)
- [ ] T049 [P] [US2] Create EmptyState component in `src/components/EmptyState/EmptyState.tsx` (displays when no expenses, with translated message)
- [ ] T050 [US2] Implement expense loading logic in `src/context/ExpenseContext.tsx` (load from localStorage on mount, parse JSON, handle corrupted data)
- [ ] T051 [US2] Implement expense sorting in `src/context/ExpenseContext.tsx` (useMemo to sort by date descending)
- [ ] T052 [P] [US2] Create ExpenseList component in `src/components/ExpenseList/ExpenseList.tsx` (receives expenses array, renders first 10 with ExpenseCard)
- [ ] T053 [P] [US2] Create ExpenseCard component in `src/components/ExpenseList/ExpenseCard.tsx` (displays amount with localized currency, date, category badge, description)
- [ ] T054 [US2] Implement calculateCategorySummaries utility in `src/utils/categorySummary.ts` (aggregate by category, sort by totalAmount descending)
- [ ] T055 [P] [US2] Create CategorySummary component in `src/components/CategorySummary/CategorySummary.tsx` (displays category totals, uses calculateCategorySummaries)
- [ ] T056 [P] [US2] Create CategoryBadge component in `src/components/CategorySummary/CategoryBadge.tsx` (colored badge for each category)
- [ ] T057 [US2] Integrate components in Dashboard: ExpenseList + CategorySummary side-by-side or stacked responsive layout
- [ ] T058 [US2] Add dark mode styles in all components (use Tailwind dark: variants for WCAG AA contrast)
- [ ] T059 [US2] Verify all US2 tests pass and dashboard displays correctly with various data scenarios

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (MVP complete!)

---

## Phase 5: User Story 3 - Edit Existing Expense (Priority: P2)

**Goal**: Allow users to correct mistakes by editing expense details

**Independent Test**: Create expense, click edit, modify amount and category, save, verify localStorage updated, category totals recalculated, UI reflects changes

### Tests for User Story 3 ⚠️

- [ ] T060 [P] [US3] Write component test for edit functionality in `src/components/ExpenseForm/__tests__/ExpenseForm.test.tsx` (test: form pre-fills with existing values when editing)
- [ ] T061 [P] [US3] Write integration test for expense update in `tests/integration/expense-crud.test.tsx` (test: edit expense → changes persist → category totals update)

### Implementation for User Story 3

- [ ] T062 [US3] Add edit mode support to ExpenseForm in `src/components/ExpenseForm/ExpenseForm.tsx` (accept initialValues prop, pre-fill form fields)
- [ ] T063 [US3] Implement updateExpense method in `src/context/ExpenseContext.tsx` (find by id, merge updates, update updatedAt timestamp, save to localStorage)
- [ ] T064 [US3] Add Edit button to ExpenseCard in `src/components/ExpenseList/ExpenseCard.tsx` (icon button with ARIA label "Edit expense")
- [ ] T065 [US3] Add edit dialog to Dashboard in `src/components/Dashboard/Dashboard.tsx` (opens ExpenseForm in edit mode with selected expense)
- [ ] T066 [US3] Add cancel functionality in ExpenseForm in `src/components/ExpenseForm/ExpenseForm.tsx` (reset form, close dialog, no data changes)
- [ ] T067 [US3] Verify category totals recalculate after edit in CategorySummary component
- [ ] T068 [US3] Verify all US3 tests pass and editing works correctly

**Checkpoint**: User Stories 1, 2, AND 3 should now be independently functional

---

## Phase 6: User Story 4 - Delete Expense (Priority: P2)

**Goal**: Enable users to remove unwanted expense records

**Independent Test**: Create 3 expenses (2 in same category, 1 in another), delete one, verify localStorage updated, category total correct, UI reflects removal

### Tests for User Story 4 ⚠️

- [ ] T069 [P] [US4] Write component test for delete confirmation in `src/components/DeleteConfirmDialog/__tests__/DeleteConfirmDialog.test.tsx` (test: dialog shows on delete click, cancel closes without deleting, confirm deletes expense)
- [ ] T070 [P] [US4] Write integration test for expense deletion in `tests/integration/expense-crud.test.tsx` (test: delete expense → removes from localStorage → category totals update → empty category hidden)

### Implementation for User Story 4

- [ ] T071 [P] [US4] Create DeleteConfirmDialog component in `src/components/DeleteConfirmDialog/DeleteConfirmDialog.tsx` (shadcn Dialog with confirmation message)
- [ ] T072 [US4] Implement deleteExpense method in `src/context/ExpenseContext.tsx` (filter out by id, save to localStorage, trigger storage event)
- [ ] T073 [US4] Add Delete button to ExpenseCard in `src/components/ExpenseList/ExpenseCard.tsx` (icon button with ARIA label "Delete expense")
- [ ] T074 [US4] Wire delete button to open DeleteConfirmDialog in Dashboard
- [ ] T075 [US4] Handle category removal when last expense deleted in CategorySummary component (empty categories should not display)
- [ ] T076 [US4] Add success notification after deletion (use toast or inline message)
- [ ] T077 [US4] Verify all US4 tests pass and deletion works correctly

**Checkpoint**: User Stories 1-4 should now all be independently functional

---

## Phase 7: User Story 5 - Multi-language Support (Priority: P3)

**Goal**: Support English and Chinese language switching with preference persistence

**Independent Test**: Switch to Chinese, verify all UI text translates, close app, reopen, verify Chinese persists, switch back to English, verify translation

### Tests for User Story 5 ⚠️

- [ ] T078 [P] [US5] Write component test for LanguageSelector in `src/components/Layout/__tests__/LanguageSelector.test.tsx` (test: clicking English switches language, clicking Chinese switches language)
- [ ] T079 [P] [US5] Write integration test for language persistence in `tests/integration/language-switching.test.tsx` (test: switch language → localStorage updated → reload → language restored)

### Implementation for User Story 5

- [ ] T080 [US5] Verify all translation keys populated in `src/i18n/en.json` (dashboard, form, categories, validation, currency, notifications, errors)
- [ ] T081 [US5] Verify all translation keys populated in `src/i18n/zh.json` (complete Chinese translations)
- [ ] T082 [US5] Add language switching logic in LanguageContext (already created in T025, verify it works)
- [ ] T083 [US5] Update LanguageSelector component to display current language and toggle
- [ ] T084 [US5] Wrap all hardcoded strings in useTranslation hook: Dashboard component
- [ ] T085 [US5] Wrap all hardcoded strings in useTranslation hook: ExpenseForm component
- [ ] T086 [US5] Wrap all hardcoded strings in useTranslation hook: ExpenseList, ExpenseCard components
- [ ] T087 [US5] Wrap all hardcoded strings in useTranslation hook: CategorySummary component
- [ ] T088 [US5] Wrap all hardcoded strings in useTranslation hook: DeleteConfirmDialog component
- [ ] T089 [US5] Update formatCurrency to use correct symbol based on language ($ for en, ¥ for zh)
- [ ] T090 [US5] Add language change event listener in ExpenseContext to re-render with new translations
- [ ] T091 [US5] Verify form partially filled preserves data when switching language
- [ ] T092 [US5] Verify all US5 tests pass and language switching works seamlessly

**Checkpoint**: User Stories 1-5 should now all be independently functional

---

## Phase 8: User Story 6 - Export Data to CSV (Priority: P3)

**Goal**: Allow users to download expense data as CSV file for backup and external analysis

**Independent Test**: Create 5 expenses, click Export CSV, verify file downloads, open in spreadsheet, verify all columns present and data correct (dates ISO format, amounts as numbers, special chars escaped)

### Tests for User Story 6 ⚠️

- [ ] T093 [P] [US6] Write unit test for csvExport in `src/utils/__tests__/csvExport.test.ts` (test: generates correct CSV format, escapes commas/quotes, handles empty description)
- [ ] T094 [P] [US6] Write integration test for CSV export in `tests/integration/csv-export.test.tsx` (test: export button → CSV generated → file contains all expenses)

### Implementation for User Story 6

- [ ] T095 [P] [US6] Implement exportExpensesToCSV utility in `src/utils/csvExport.ts` (convert expenses to CSV string, handle special characters, create Blob, trigger download)
- [ ] T096 [P] [US6] Create ExportButton component in `src/components/ExportButton/ExportButton.tsx` (button with download icon, ARIA label)
- [ ] T097 [US6] Add ExportButton to Dashboard header
- [ ] T098 [US6] Wire ExportButton to call exportExpensesToCSV with current expenses
- [ ] T099 [US6] Handle empty expenses case in CSV export (download with headers only)
- [ ] T100 [US6] Add success notification after CSV export ("Exported N expenses")
- [ ] T101 [US6] Verify CSV format: Date, Amount, Category, Description, Created At, Updated At columns
- [ ] T102 [US6] Verify all US6 tests pass and CSV export works correctly

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Cross-Cutting Concerns & Polish

**Purpose**: Improvements that affect multiple user stories and final touches

- [ ] T103 [P] Implement multi-tab synchronization in `src/hooks/useStorageSync.ts` (listen to storage events, update context when other tab changes data)
- [ ] T104 [P] Add storage capacity warning in `src/utils/localStorage.ts` (check size, show warning at 80% capacity)
- [ ] T105 [P] Implement storage error handling in ExpenseContext (catch QuotaExceededError, offer export+clear option)
- [ ] T106 [P] Add loading states to Dashboard (skeleton loaders while loading from localStorage)
- [ ] T107 [P] Add debouncing to form inputs if needed (prevent rapid submissions)
- [ ] T108 [P] Optimize category summary calculation with useMemo in CategorySummary component
- [ ] T109 [P] Add React.memo to ExpenseCard component for performance
- [ ] T110 [P] Verify keyboard navigation works for all interactive elements (Tab order, Enter/Space activation, Escape closes dialogs)
- [ ] T111 [P] Run accessibility audit with Lighthouse (target WCAG 2.1 Level AA compliance)
- [ ] T112 [P] Test responsive layout on 320px (mobile), 768px (tablet), 1024px+ (desktop)
- [ ] T113 [P] Verify color contrast ratios ≥ 4.5:1 in both light and dark themes
- [ ] T114 [P] Add focus indicators for keyboard navigation
- [ ] T115 [P] Test with screen reader (NVDA on Windows or VoiceOver on Mac)
- [ ] T116 Write end-to-end tests in `tests/e2e/user-journeys.spec.ts` (optional: complete user journeys with Playwright)
- [ ] T117 Run full test suite and verify >80% coverage (npm run test:coverage)
- [ ] T118 Build for production and verify no errors (npm run build)
- [ ] T119 Test production build locally (npm run preview)
- [ ] T120 Create README.md with setup instructions, feature overview, tech stack
- [ ] T121 Update `.cursor/rules/specify-rules.mdc` if needed for project-specific patterns
- [ ] T122 Final code review against constitution checklist (all 5 principles)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel (if staffed) after Foundational is done
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (but displays expenses created by US1)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1's ExpenseForm, but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Works with existing expenses, independently testable
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Wraps existing components, independently testable
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Exports existing expenses, independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD workflow)
- Models/types before services/context
- Services/context before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, ALL user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (write tests first!):
T029: Write ExpenseForm validation tests
T030: Write ExpenseForm submission tests  
T031: Write expense creation integration test

# These tests should FAIL initially

# Then implement in parallel:
T032: Create ExpenseForm skeleton (can work simultaneously with T038)
T038: Create ExpenseContext (can work simultaneously with T032)

# After both complete, wire them together:
T041: Integrate ExpenseForm into Dashboard
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T028) - **CRITICAL BLOCKER**
3. Complete Phase 3: User Story 1 - Add Expense (T029-T043)
4. Complete Phase 4: User Story 2 - View Dashboard (T044-T059)
5. **STOP and VALIDATE**: Test US1 + US2 independently, verify MVP works
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **MVP Sprint 1**
3. Add User Story 2 → Test independently → **MVP Sprint 2** (can now demo full MVP!)
4. Add User Story 3 → Test independently → **Enhancement Sprint 1**
5. Add User Story 4 → Test independently → **Enhancement Sprint 2**
6. Add User Story 5 → Test independently → **i18n Sprint**
7. Add User Story 6 → Test independently → **Export Sprint**
8. Polish phase → Final touches

Each story adds value without breaking previous stories!

### Parallel Team Strategy

With multiple developers after Foundational phase:

- **Developer A**: User Story 1 (Add Expense) - T029-T043
- **Developer B**: User Story 2 (View Dashboard) - T044-T059
- **Developer C**: Setup foundations for US3 (Edit) or work on Polish tasks

Stories complete and integrate independently.

---

## Notes

- **[P] tasks** = different files, no dependencies on incomplete tasks
- **[Story] label** maps task to specific user story for traceability
- **Each user story** should be independently completable and testable
- **Verify tests fail** before implementing (TDD principle)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Constitution compliance**: Every task must align with 5 core principles (quality, testing, UX, storage, components)
- **Accessibility**: Test keyboard navigation and screen reader at checkpoints
- **Performance**: Monitor localStorage size, dashboard load time at checkpoints

---

## Task Count Summary

- **Total Tasks**: 122
- **Setup (Phase 1)**: 10 tasks
- **Foundational (Phase 2)**: 18 tasks
- **User Story 1 (P1)**: 15 tasks (3 test + 12 implementation)
- **User Story 2 (P1)**: 16 tasks (4 test + 12 implementation)
- **User Story 3 (P2)**: 9 tasks (2 test + 7 implementation)
- **User Story 4 (P2)**: 9 tasks (2 test + 7 implementation)
- **User Story 5 (P3)**: 15 tasks (2 test + 13 implementation)
- **User Story 6 (P3)**: 10 tasks (2 test + 8 implementation)
- **Polish (Phase 9)**: 20 tasks

**MVP Scope** (US1 + US2): 28 tasks + Setup (10) + Foundational (18) = **56 tasks total for MVP**

**Parallel Opportunities**: 45+ tasks marked with [P] for parallel execution

**Independent Test Criteria**: Each user story has explicit test scenarios and checkpoint validations

