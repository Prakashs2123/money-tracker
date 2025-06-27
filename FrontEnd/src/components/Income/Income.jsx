import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Income.css';
import IncomeModal from './IncomeModal';
import { MdDelete } from 'react-icons/md';


const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
    emoji: ''
  });

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      const incomeOnly = res.data.filter(item => item.type === 'income');
      setIncomeData(incomeOnly);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`);
      fetchIncome();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAddIncome = async () => {
    const newIncome = {
      type: 'income',
      source: formData.source,
      amount: parseInt(formData.amount),
      date: formData.date,
      emoji: formData.emoji
    };

    try {
      await axios.post('http://localhost:5000/api/transactions', newIncome);
      fetchIncome();
      setShowModal(false);
      setFormData({ source: '', amount: '', date: '', emoji: '' });
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  return (
    <div className="income-container">
      <div className="income-header">
        <h2>Income Sources</h2>
        <button className="add-income-btn" onClick={() => setShowModal(true)}>➕ Add Income</button>
      </div>

      <div className="income-list">
        {incomeData.map((item) => (
          <div className="income-item" key={item._id}>
            <div className="income-left">
              <span className="income-icon">{item.emoji || '💰'}</span>
              <div>
                <p className="income-name">{item.source}</p>
                <p className="income-date">{item.date}</p>
              </div>
            </div>
            <div className="income-right">
<button className="delete-btn" onClick={() => handleDelete(item._id)}>
  <MdDelete className="delete-icon" />
</button>
  <p className="income-amount">+ ₹{item.amount}</p>
</div>

          </div>
        ))}
      </div>

      {showModal && (
        <IncomeModal
          formData={formData}
          setFormData={setFormData}
          onAdd={handleAddIncome}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Income;
