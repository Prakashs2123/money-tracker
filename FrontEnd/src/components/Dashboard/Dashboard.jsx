import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Financialoverview from './Finacialoverview';
import TransactionList from './TransactionList';
import axios from 'axios';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/summary')
      .then(res => {
        setSummary(res.data);
      })
      .catch(err => console.log("Error fetching summary:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="summary-cards">
        <div className="card balance">
          <div className="card-header">
            <img src="/balance.png" alt="Balance Icon" className="icon-img" />
            <div className="card-text">
              <h3>Balance</h3>
              <p>₹ {summary.balance}</p>
            </div>
          </div>
        </div>

        <div className="card income">
          <div className="card-header">
            <img src="/income.png" alt="Income Icon" className="icon-img" />
            <div className="card-text">
              <h3>Income</h3>
              <p>₹ {summary.income}</p>
            </div>
          </div>
        </div>

        <div className="card expense">
          <div className="card-header">
            <img src="/Expense.png" alt="Expense Icon" className="icon-img" />
            <div className="card-text">
              <h3>Expense</h3>
              <p>₹ {summary.expense}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-lower">
        <TransactionList />
        <Financialoverview
  income={summary.income}
  expense={summary.expense}
  balance={summary.balance}
/>

      </div>
    </div>
  );
};

export default Dashboard;
