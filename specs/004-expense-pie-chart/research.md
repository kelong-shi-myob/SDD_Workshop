# Research: Expense Category Visualization

## Decision: Charting Library
**Decision**: Use **Recharts** library.
**Rationale**: 
- Explicit user preference.
- React-native implementation (component-based), fitting the "Component-Driven Development" principle.
- Built-in support for responsive containers, tooltips, and legends, which meets all functional requirements.
- Declarative API matches the project's React functional component style.

**Alternatives Considered**:
- **Chart.js**: Imperative API, harder to integrate with React lifecycle without wrappers.
- **D3.js**: Too low-level, high complexity for a simple pie chart.
- **Raw SVG**: High effort to implement interaction (tooltips) and responsiveness.

## Implementation Strategy

### Data Transformation
The chart requires data in a specific shape:
```javascript
[
  { name: 'Food', value: 400 },
  { name: 'Transport', value: 300 }
]
```
Existing `Expense` data (Array of objects) must be aggregated by category before passing to the chart. This logic should reside in a utility function (testable logic).

### Color Palette
We need a dynamic palette. Recharts allows mapping colors to `Cell` components.
We will define a constant array of hex codes (harmonious with Pico.css if possible, or standard distinct colors) and assign them cyclically.

### Responsiveness
Use `ResponsiveContainer` from Recharts to ensure the chart adapts to mobile vs desktop widths, fulfilling the layout clarification.

