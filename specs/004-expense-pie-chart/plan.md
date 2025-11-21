# Implementation Plan: Expense Category Visualization

**Branch**: `004-expense-pie-chart` | **Date**: 2025-11-21 | **Spec**: [specs/004-expense-pie-chart/spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-expense-pie-chart/spec.md`

## Summary
Implement a **Pie Chart** visualization on the dashboard using the **Recharts** library. The feature involves adding a new dependency, creating a data aggregation utility (TDD), and building a responsive React component that renders the chart with tooltips and a legend.

## Technical Context

**Language/Version**: JavaScript (ES6+) / React 18+
**Primary Dependencies**: `recharts` (New), `@picocss/pico` (Existing)
**Storage**: `localStorage` (Read-only for this feature)
**Testing**: `node:test` for aggregation logic
**Target Platform**: Modern Web Browsers (Mobile & Desktop)
**Project Type**: Single Page Application (Vite)
**Performance Goals**: Instant render (<100ms) for typical expense lists (<1000 items).
**Constraints**: No external state management; Logic must be tested.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Code Quality**: Standard JS/ES6+.
- [x] **Testing**: Logic (aggregation) will be TDD'd using `node:test`.
- [x] **UX**: Uses Pico.css for layout; Recharts for visualization (User Preference Exception).
- [x] **Storage**: Reads from existing localStorage pattern.
- [x] **Component-Driven**: Isolated `ExpensePieChart` component.
- [x] **Tech Stack**: React + Vite. **Exception**: `recharts` added per user request (allowed).

## Project Structure

### Documentation (this feature)

```text
specs/004-expense-pie-chart/
├── plan.md              # This file
├── research.md          # Implementation strategy & decisions
├── data-model.md        # Data shapes & transformation logic
├── quickstart.md        # Usage guide
├── contracts/           # Interface definitions
└── tasks.md             # Task breakdown
```

### Source Code

```text
src/
├── components/
│   └── ExpensePieChart.jsx    # New: The visualization component
├── utils/
│   └── expenseUtils.js        # Update: Add aggregation logic
└── App.jsx                    # Update: Integrate chart into dashboard
tests/
└── logic/
    └── expenseUtils.test.js   # Update: Test aggregation logic
```

**Structure Decision**: Single project structure (Option 1). Adding components and utils to existing folders.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `recharts` Dependency | User Preference & Complexity | SVG/Canvas from scratch is too complex/error-prone for this timeline. |
