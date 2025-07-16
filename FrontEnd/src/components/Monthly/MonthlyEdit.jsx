// components/MonthlyEditModal.jsx
import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import './Monthly.css'; // You can reuse your existing modal CSS

const MonthlyEdit = ({
  formData,
  handleChange,
  handleEmojiClick,
  showEmojiPicker,
  setShowEmojiPicker,
  onUpdate,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Transaction</h3>
        <input
          type="text"
          name="source"
          placeholder="Source Name"
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

        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          {formData.emoji || '😀'} Choose Emoji
        </button>
        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}

        <div className="modal-actions">
          <button className="add-btn" onClick={onUpdate}>Update</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEdit;
