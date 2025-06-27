import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const IncomeModal = ({ formData, setFormData, onAdd, onClose }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    setFormData(prev => ({ ...prev, emoji: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Income</h3>
        <input type="text" name="source" placeholder="Source Name" value={formData.source} onChange={handleChange} />
        <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} />
        <input type="date" name="date" value={formData.date} onChange={handleChange} />

        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {formData.emoji || '😀'} Choose Emoji
        </button>
        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}

        <div className="modal-actions">
          <button className="add-btn" onClick={onAdd}>Add</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default IncomeModal;
