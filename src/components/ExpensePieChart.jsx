import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CATEGORY_COLORS } from '../utils/constants';

/**
 * Pie chart component to visualize expenses by category.
 * 
 * @param {Object} props
 * @param {Array<{name: string, value: number}>} props.data - Aggregated expense data
 */
export const ExpensePieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <article style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No expenses to display yet.</p>
      </article>
    );
  }

  return (
    <article>
      <header>
        <strong>Expense Breakdown</strong>
      </header>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ fontSize: '0.8rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};

