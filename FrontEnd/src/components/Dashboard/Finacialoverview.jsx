import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const Financialoverview = ({ income, expense, balance }) => {
  const chartData = [
    { name: 'Total Balance', value: balance, color: '#8e44ad' },
    { name: 'Total Expenses', value: expense, color: '#e74c3c' },
    { name: 'Total Income', value: income, color: '#f39c12' },
  ];

  return (
    <div className="overview card">
      <h3>Financial Overview (This Month)</h3>
      <div className="pie-wrapper">
        <PieChart width={250} height={250}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={({ cx, cy }) => (
              <>
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '12px', fill: '#555' }}
                >
                  Balance
                </text>
                <text
                  x={cx}
                  y={cy + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '14px', fontWeight: 'bold', fill: '#000' }}
                >
                  ₹ {balance}
                </text>
              </>
            )}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="chart-legend">
        {chartData.map((d, i) => (
          <div key={i} className="legend-item">
            <span style={{ backgroundColor: d.color }}></span> {d.name}
          </div>
        ))}
      </div>
    </div>
  );
};


export default Financialoverview;
