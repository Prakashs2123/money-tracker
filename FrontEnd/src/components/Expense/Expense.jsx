import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Expense.css';
import ExpenseModal from './ExpenseModal';
import { MdDelete } from 'react-icons/md';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      const expenseOnly = res.data.filter(item => item.type === 'expense');
      setExpenses(expenseOnly);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleAddExpense = async (expense) => {
    const newExpense = {
      ...expense,
      type: 'expense'
    };

    try {
      await axios.post('http://localhost:5000/api/transactions', newExpense);
      fetchExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <div className="expense-container">
      <div className="expense-header">
        <h2>Expenses</h2>
        <button className="add-expense-btn" onClick={() => setShowModal(true)}>➖ Add Expense</button>
      </div>

      <div className="expense-list">
        {expenses.map((item) => (
          <div className="expense-item" key={item._id}>
            <div className="expense-left">
              <span className="expense-icon">{item.emoji || '💸'}</span>
              <div>
                <p className="expense-name">{item.source}</p>
                <p className="expense-date">{item.date}</p>
              </div>
            </div>
            <div className="expense-right">
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                <MdDelete />
              </button>
              <p className="expense-amount">- ₹{item.amount}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ExpenseModal
          onAdd={handleAddExpense}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Expense;
