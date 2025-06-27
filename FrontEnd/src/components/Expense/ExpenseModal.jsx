import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const ExpenseModal = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
    emoji: '💸'
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmojiClick = (emojiData) => {
    setFormData(prev => ({ ...prev, emoji: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = () => {
    if (!formData.source || !formData.amount || !formData.date) return;
    onAdd(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Expense</h3>

        <input
          type="text"
          name="source"
          placeholder="Expense Name"
          value={formData.source}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <div>
          <button onClick={() => setShowEmojiPicker(prev => !prev)}>
            {formData.emoji} Choose Emoji
          </button>
          {showEmojiPicker && (
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          )}
        </div>

        <div className="modal-actions">
          <button className="add-btn" onClick={handleSubmit}>Add</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
