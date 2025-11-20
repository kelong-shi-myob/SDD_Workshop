# SDD Workshop Constitution

<!--
SYNC IMPACT REPORT
==================
Version: NEW → 1.0.0 (Initial Release)
Rationale: First constitution establishing foundational principles for ReactJS SPA development

Added Principles:
- I. Code Quality First
- II. Testing Standards (Non-Negotiable)
- III. User Experience Consistency
- IV. Single Storage Technology
- V. Component-Driven Development

Added Sections:
- Technology Stack (ReactJS + shadcn requirements)
- Development Workflow (quality gates and review process)

Template Status:
✅ plan-template.md - Aligned (Constitution Check section will validate these principles)
✅ spec-template.md - Aligned (User stories and requirements structure supports UX consistency)
✅ tasks-template.md - Aligned (Testing phases support testing standards)

Follow-up TODOs:
- None (all placeholders filled)

Last Updated: 2025-11-19
-->

## Core Principles

### I. Code Quality First

Every code contribution MUST meet quality standards before merge:
- **Type Safety**: All TypeScript code MUST use strict mode with no `any` types unless explicitly justified
- **Linting**: Zero ESLint errors; warnings must be addressed or suppressed with documented rationale
- **Code Review**: All PRs require approval from at least one team member verifying adherence to these principles
- **Clean Code**: Functions should be small (< 50 lines), single-purpose, and well-named
- **Documentation**: Complex logic MUST include inline comments explaining the "why", not just the "what"

**Rationale**: Quality code reduces bugs, improves maintainability, and accelerates long-term velocity. Technical debt compounds quickly in React applications due to component interdependencies.

### II. Testing Standards (NON-NEGOTIABLE)

Testing is mandatory for all features following a test-driven approach:
- **Test-First Development**: Write tests BEFORE implementation; tests MUST fail initially, then pass after implementation
- **Coverage Requirements**: 
  - Component logic: Minimum 80% coverage via unit tests
  - User journeys: Critical paths MUST have integration tests
  - UI components: Key interactions MUST have React Testing Library tests
- **Test Structure**: 
  - Unit tests: `src/components/[ComponentName]/__tests__/[ComponentName].test.tsx`
  - Integration tests: `tests/integration/`
  - E2E tests (if applicable): `tests/e2e/`
- **Testing Philosophy**: Tests should verify behavior, not implementation details

**Rationale**: Untested code is legacy code. Test-first development catches issues early, documents expected behavior, and enables confident refactoring. This is especially critical for SPAs where UI bugs directly impact user experience.

### III. User Experience Consistency

All user-facing features MUST deliver a consistent, accessible, and delightful experience:
- **Design System**: Use shadcn components exclusively; custom components MUST match shadcn's design language
- **Accessibility**: WCAG 2.1 Level AA compliance MUST be verified:
  - Semantic HTML elements
  - ARIA labels where necessary
  - Keyboard navigation support
  - Color contrast ratios ≥ 4.5:1 for normal text
- **Responsive Design**: All interfaces MUST work seamlessly on mobile (320px), tablet (768px), and desktop (1024px+)
- **Loading States**: All async operations MUST show loading indicators; errors MUST display user-friendly messages
- **Performance**: Initial page load < 3 seconds; interactions respond within 100ms

**Rationale**: Consistent UX builds user trust and reduces cognitive load. Accessibility is a legal requirement and ethical imperative. Performance directly correlates with user satisfaction and conversion rates.

### IV. Single Storage Technology

All client-side data persistence MUST use localStorage exclusively:
- **One Technology**: No mixing of localStorage, sessionStorage, IndexedDB, or cookies for application data
- **Namespace Keys**: All keys MUST be prefixed with application identifier (e.g., `sdd_workshop_`)
- **Data Structure**: Store complex objects as JSON strings; include version identifier for migration support
- **Size Limits**: Monitor localStorage usage; warn users when approaching 5MB browser limit
- **Error Handling**: Gracefully handle QuotaExceededError with user notification
- **Security**: NEVER store sensitive data (tokens, passwords) in localStorage without encryption

**Rationale**: Using a single storage technology eliminates confusion, simplifies debugging, and ensures predictable behavior across browsers. localStorage provides sufficient capacity for most SPA data needs while maintaining simplicity.

### V. Component-Driven Development

Build the application as a composition of reusable, isolated components:
- **Component Structure**: 
  - Presentational components: Pure UI, no business logic
  - Container components: Handle state and business logic
  - Layout components: Manage page structure and composition
- **Props Over Prop Drilling**: For deeply nested components, use Context API (max 2-3 contexts)
- **Single Responsibility**: Each component has ONE clear purpose
- **Reusability**: Before creating a component, check if existing shadcn or custom components suffice
- **Component Documentation**: Export interface/type definitions; include JSDoc for complex props

**Rationale**: Component-driven architecture maximizes reusability, simplifies testing, and enables parallel development. Clear separation of concerns makes the codebase easier to understand and maintain.

## Technology Stack

### Mandatory Technologies

- **Framework**: React 18+ (using functional components and hooks exclusively)
- **Language**: TypeScript 5+ with strict mode enabled
- **Component Library**: shadcn/ui (with Tailwind CSS for styling)
- **Build Tool**: Vite (for fast development and optimized production builds)
- **State Management**: React hooks (useState, useReducer, useContext); complex state may use Zustand if justified
- **Routing**: React Router 6+
- **Client Storage**: localStorage (as per Principle IV)
- **Testing**: 
  - Unit/Component: Vitest + React Testing Library
  - E2E (if needed): Don't need
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

### Prohibited Without Justification

- Alternative component libraries (Material-UI, Ant Design, etc.)
- Class components (use functional components)
- Multiple storage technologies (sessionStorage, IndexedDB, cookies for app data)
- Inline styles (use Tailwind classes or CSS modules)

### Upgrade Policy

- Dependencies MUST stay within one major version of latest stable
- Security patches MUST be applied within 7 days of disclosure
- Document breaking changes in CHANGELOG.md

## Development Workflow

### Quality Gates

All PRs MUST pass these gates before merge:

1. **Constitution Compliance**: Reviewer verifies adherence to all five core principles
2. **Tests Pass**: All tests green in CI/CD; new features include new tests
3. **Type Check**: `tsc --noEmit` passes with zero errors
4. **Linting**: `eslint` passes with zero errors
5. **Build Success**: Production build completes without warnings
6. **Manual Review**: At least one team member approves changes

### Code Review Checklist

Reviewers MUST verify:
- [ ] Tests written before implementation (if feature PR)
- [ ] TypeScript strict mode compliance
- [ ] shadcn components used where applicable
- [ ] localStorage keys properly namespaced (if storage used)
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard navigation
- [ ] Responsive design: works on mobile, tablet, desktop
- [ ] Loading and error states implemented
- [ ] Component is reusable and follows single responsibility
- [ ] No console.log or debugging code
- [ ] Changes documented in code comments if complex

### Complexity Justification

Any violation of constitution principles MUST be documented in PR description:
- **What**: Specific principle being violated
- **Why**: Problem that necessitates the violation
- **Alternatives**: Simpler approaches considered and why rejected
- **Mitigation**: How negative impacts will be minimized

## Governance

### Amendment Process

This constitution can only be amended through:
1. Proposal documented with rationale and impact analysis
2. Team discussion and consensus
3. Update to this file with version bump (see below)
4. Synchronization of all dependent templates and documentation

### Versioning

- **MAJOR (X.0.0)**: Principle removed or redefined in backward-incompatible way
- **MINOR (0.X.0)**: New principle added or existing principle materially expanded
- **PATCH (0.0.X)**: Clarifications, typo fixes, non-semantic refinements

### Compliance Review

- Constitution compliance MUST be verified during code review (see checklist above)
- Monthly retrospectives SHOULD include constitution effectiveness assessment
- Recurring violations indicate need for training or principle revision
- Use `.specify/templates/checklist-template.md` for feature-level compliance tracking

### Living Document

This constitution is a living document:
- Principles evolve based on team learnings and project needs
- Feedback from retrospectives informs amendments
- When principles prove impractical, update them rather than ignore them
- Document all changes in the Sync Impact Report (HTML comment at top of file)

**Version**: 1.0.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
