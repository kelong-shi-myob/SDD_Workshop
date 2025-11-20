# SDD Workshop Constitution

<!--
SYNC IMPACT REPORT
==================
Version: 2.3.0 → 2.4.0 (Minor Revision)
Rationale: Drastic simplification for "Zero-Friction" workshop execution. Removing bureaucratic overhead, linting gates, and external dependencies to focus purely on product loop speed.

Modified Principles:
- I. Code Quality First (Replaced Linting with "No Console Errors")
- II. Testing Standards (Added node:test as zero-dependency option)
- V. Component-Driven Development (Enforced native state management only)
- Tech Stack (Removed external state libs; added node:test)
- Development Workflow (Simplified gates to 3 checks)

Removed Sections:
- Upgrade Policy
- Complexity Justification
- Governance (Amendment Process, Compliance Review)

Template Status:
✅ plan-template.md - Aligned
✅ spec-template.md - Aligned
✅ tasks-template.md - Aligned

Follow-up TODOs:
- None
-->

## Core Principles

### I. Code Quality First

Every code contribution MUST meet quality standards before merge:
- **Language Standards**: Use modern JavaScript (ES6+) features.
- **Console Safety**: Zero browser console errors during usage.
- **Code Review**: All PRs require approval verifying adherence to these principles.
- **Clean Code**: Functions should be small, single-purpose, and well-named.
- **Documentation**: Complex logic MUST include inline comments explaining the "why".

**Rationale**: Speed is paramount. Browser console errors are the only critical "linting" metric that matters for a demo. We skip static analysis configuration to avoid environment conflict.

### II. Testing Standards (Targeted TDD)

Testing follows a pragmatic, risk-based approach:
- **TDD for Logic**: Business logic and utility functions MUST be developed Test-First.
- **Tooling**: Prefer **Node.js Native Test Runner (`node:test`)** for zero-dependency testing.
- **UI Components**: Unit tests for UI components are OPTIONAL.
- **Coverage**: High confidence for logic; no mandate for UI.

**Rationale**: `node:test` requires no installation, saving time. Strict TDD is preserved only for pure logic where it offers the highest return on investment.

### III. User Experience Consistency

All user-facing features MUST deliver a consistent and usable experience:
- **Styling Strategy**: Use **Pico.css** exclusively.
  - **Implementation**: Rely on semantic HTML tags (e.g., `<button>`, `<article>`, `<header>`).
  - **Goal**: Zero class-name cognitive load; write HTML, get professional UI instantly.
- **Accessibility**: Maintain basic accessibility (semantic HTML, keyboard navigation).
- **Responsive Design**: Interfaces should be usable on standard desktop and mobile viewports.
- **Loading States**: Async operations MUST show feedback.

**Rationale**: Standardizing on Pico.css eliminates decision fatigue and CSS maintenance.

### IV. Single Storage Technology

All client-side data persistence MUST use localStorage exclusively:
- **One Technology**: No mixing of storage mechanisms.
- **Namespace Keys**: All keys MUST be prefixed (e.g., `workshop_app_`).
- **Data Structure**: Store complex objects as JSON strings.
- **Security**: NEVER store sensitive data in localStorage.

**Rationale**: Using a single storage technology eliminates confusion and simplifies debugging.

### V. Component-Driven Development

Build the application as a composition of reusable components:
- **State Management**: Use **React Context + useReducer** ONLY. No external libraries.
- **Component Structure**: Separate logic from UI.
- **Single Responsibility**: Each component has ONE clear purpose.

**Rationale**: External state libraries add installation time and complexity. Native React hooks are sufficient for workshop scope.

## Technology Stack

### Mandatory Technologies

- **Framework**: React 18+ (Functional Components + Hooks).
- **Language**: JavaScript (ES6+).
- **Build Tool**: Vite (Minimal configuration).
- **Styling**: **Pico.css** (Install via npm or CDN).
- **State Management**: React Hooks (`useState`, `useContext`, `useReducer`).
- **Testing**: `node:test` (Preferred) or Vitest (Logic only).
- **Client Storage**: localStorage.
- **View Management**: Conditional Rendering (e.g., `if (view === 'home')`).

### Prohibited / Discouraged

- **Routing Libraries**: React Router, TanStack Router.
- **State Libraries**: Zustand, Redux, MobX, Recoil (Prohibited).
- **TypeScript**: Avoid to save generation/transpilation time.
- **Heavy Config UI Libs**: Tailwind CSS, Material-UI, Bootstrap.
- **CSS-in-JS**: Emotion, Styled-Components.

## Development Workflow

### Quality Gates

All PRs MUST pass these 3 simple checks:

1. **Works**: Feature functions as described in the spec.
2. **Clean**: No errors in the browser console.
3. **Tests**: Logic/Util tests pass (green).

### Code Review Checklist

Reviewers MUST verify:
- [ ] TDD followed for Utils/Logic.
- [ ] Styling uses Pico.css (semantic HTML).
- [ ] No external state libraries used.
- [ ] No console errors.
- [ ] Standard JavaScript best practices.

## Governance

### Versioning

- **MAJOR (X.0.0)**: Principle removed or redefined in backward-incompatible way
- **MINOR (0.X.0)**: New principle added or existing principle materially expanded
- **PATCH (0.0.X)**: Clarifications, typo fixes, non-semantic refinements

**Version**: 2.4.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-20
