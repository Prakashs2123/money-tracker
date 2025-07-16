import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Income.css';
import IncomeModal from './IncomeModal';
import { MdDelete } from 'react-icons/md';
import { GlobalContext } from '../../Context/GlobalContext';
// import { GlobalContext } from '../../context/GlobalContext';

const Income = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
    emoji: ''
  });

  const { fetchSummary } = useContext(GlobalContext);

  useEffect(() => {
    fetchIncome();
  }, []);

 const fetchIncome = async () => {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  try {
    const res = await axios.get(`http://localhost:5000/api/transactions?type=income&email=${email}`);
    const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date)); // sort by date desc
    setIncomeData(sorted);
  } catch (err) {
    console.error('Fetch error:', err);
  }
};



  const handleDelete = async (id) => {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  try {
    await axios.delete(`http://localhost:5000/api/transactions/${id}?email=${email}`);
    fetchIncome();
    fetchSummary();
  } catch (err) {
    console.error('Delete error:', err);
  }
};


  const handleAddIncome = async () => {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  const newIncome = {
    ...formData,
    type: 'income',
    email: email
  };

  try {
    await axios.post('http://localhost:5000/api/transactions', newIncome);
    fetchIncome();     // refresh income list
    fetchSummary();    // update dashboard summary
    setShowModal(false);
    setFormData({ source: '', amount: '', date: '', emoji: '' });
  } catch (err) {
    console.error("Error adding income:", err);
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
                <p className="income-date">
  {new Date(item.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
</p>

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
