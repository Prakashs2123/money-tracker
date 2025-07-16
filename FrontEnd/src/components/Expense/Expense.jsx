import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Expense.css';
import ExpenseModal from './ExpenseModal';
import { MdDelete } from 'react-icons/md';
import { GlobalContext } from '../../Context/GlobalContext';
// import { GlobalContext } from '../../context/GlobalContext';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { fetchSummary } = useContext(GlobalContext);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  try {
    const res = await axios.get(`http://localhost:5000/api/transactions?type=expense&email=${email}`);
    const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by date descending
    setExpenses(sorted);
  } catch (err) {
    console.error("Error fetching expenses:", err);
  }
};



  const handleAddExpense = async (expense) => {
  const email = localStorage.getItem("userEmail");

  const newExpense = {
    ...expense,
    type: 'expense',
    email: email   //  attach logged-in user email
  };

  try {
    await axios.post('http://localhost:5000/api/transactions', newExpense);
    fetchExpenses();
    fetchSummary(); // sync summary
  } catch (err) {
    console.error("Error adding expense:", err);
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchExpenses();
      fetchSummary(); // sync summary
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
                <p className="expense-date">
  {new Date(item.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
</p>

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
