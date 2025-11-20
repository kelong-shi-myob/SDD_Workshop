# Quickstart: Personal Expense Tracker

## Prerequisites
- Node.js 18+ (for `node:test` and Vite)
- NPM

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access app at `http://localhost:5173`

3. **Run Tests**:
   ```bash
   npm test
   ```

## Usage Guide

### Adding an Expense
1. Click the **"Add Expense"** button on the Dashboard.
2. Fill in Amount, Date, Category, and Description.
3. Click **"Save"**.
4. You will be redirected to the Dashboard.

### Viewing Expenses
- The **Dashboard** shows the 10 most recent expenses.
- The **Category Summary** shows total spend per category.

## Troubleshooting

- **Data not saving?**: Ensure your browser allows `localStorage`.
- **"Quota Exceeded" error**: You have stored >5MB of data (unlikely). Clear browser data to reset.

