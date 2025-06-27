import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';


const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions/latest')
      .then(res => setTransactions(res.data))
      .catch(err => console.error("Error fetching latest transactions:", err));
  }, []);

  return (
    <div className="transaction card">
      <div className="trans-header">
        <h3>Recent Transactions</h3>
        <button className="see-all" onClick={()=>navigate('/Expense')}>See All →</button>
      </div>
      <ul className="trans-list">
        {transactions.map((tx, index) => (
          <li key={index} className="trans-item">
            <div className="trans-info">
              <span className="trans-icon">{tx.emoji || '💰'}</span>
              <div>
                <p className="trans-name">{tx.source}</p>
                <p className="trans-date">{tx.date}</p>
              </div>
            </div>
            <div className={`trans-amount ${tx.type === 'income' ? 'green' : 'red'}`}>
              {tx.type === 'income' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
