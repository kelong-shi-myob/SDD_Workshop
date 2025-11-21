# Research: Edit and Remove Expense Records

## Decision: State Management for Routing
**Decision**: Use existing React Context/Reducer state to handle navigation and data passing.
**Rationale**: 
- Constitution mandates "Native React hooks" only.
- Avoiding external routers simplifies the app for this scale.
- We already have `currentView` in state; adding `editingId` or passing params to `setView` is a natural extension.

## Decision: UI Pattern for Edit
**Decision**: Reuse `AddExpense` view as `ExpenseForm`.
**Rationale**:
- Reduces code duplication (DRY).
- Ensures consistent validation logic.
- "Add" and "Edit" are essentially the same operation (Upsert) with different initial states.

## Decision: Deletion UX
**Decision**: Immediate deletion (no confirmation) per clarification.
**Rationale**:
- Prioritizes speed and friction reduction.
- User explicitly requested this approach.

## Implementation Strategy

### State Updates
- **Actions**: Add `DELETE_EXPENSE` and `SET_EDIT_MODE` (or generic `SET_VIEW` payload).
- **Reducer**: Handle filtering for delete; handle finding expense by ID for edit.

### Component Refactoring
- Rename `AddExpense` view to `ExpenseForm` (or similar generic name).
- Update it to accept `initialData` or look it up from context based on an ID.
- Change "Add" button to "Save" button dynamic text.

