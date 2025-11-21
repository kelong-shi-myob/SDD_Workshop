/**
 * Interface for the aggregated data expected by the Pie Chart.
 * @typedef {Object} CategorySummary
 * @property {string} name - The category label
 * @property {number} value - The total aggregated amount
 */

/**
 * Interface for the ExpensePieChart component props.
 * @typedef {Object} ExpensePieChartProps
 * @property {CategorySummary[]} data - The aggregated data to display
 */

/**
 * Contract for the aggregation function.
 * @param {Array<{category: string, amount: number}>} expenses
 * @returns {CategorySummary[]}
 */
export const AGGREGATION_CONTRACT = {
  inputs: 'Array of Expense objects',
  outputs: 'Array of CategorySummary objects (sorted desc, value > 0)'
};

