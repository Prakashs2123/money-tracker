import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Transaction.css'; // Optional for styling

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);

 useEffect(() => {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    console.error("User email not found in localStorage");
    return;
  }

  axios.get(`http://localhost:5000/api/transactions?email=${email}`)
    .then(res => {
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by date desc
      setTransactions(sorted);
    })
    .catch(err => console.error("Error fetching transactions:", err));
}, []);

  return (
    <div className="all-transactions card">
      <h3>All Transactions</h3>
      <ul className="transaction-list">
        {transactions.map((tx) => (
          <li key={tx._id} className="transaction-item">
            <div className="tx-left">
              <span className="tx-icon">{tx.emoji || '💰'}</span>
              <div>
                <p className="tx-source">{tx.source}</p>
                <p className="tx-date">
  {new Date(tx.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
</p>

              </div>
            </div>
            <div className={`tx-amount ${tx.type === 'income' ? 'green' : 'red'}`}>
              {tx.type === 'income' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transaction;
