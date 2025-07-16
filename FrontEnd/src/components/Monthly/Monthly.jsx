import React, { useEffect, useState, useContext } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameMonth } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import axios from 'axios';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Monthly.css';
import { GlobalContext } from '../../Context/GlobalContext';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const Monthly = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const { fetchSummary, fetchTransactions } = useContext(GlobalContext);

  const loadEvents = async () => {
  const email = localStorage.getItem("userEmail"); // 👈 get user's email
  if (!email) return;

  const res = await axios.get(`http://localhost:5000/api/transactions?email=${email}`);
  const txs = res.data.map(tx => ({
    ...tx,
    title: `${tx.emoji || '💰'} ${tx.source} ₹${tx.amount}`,
    allDay: true,
    start: new Date(tx.date),
    end: new Date(tx.date),
  }));
  setMyEvents(txs);
};


  useEffect(() => {
    loadEvents();
  }, []);

  const handleSelectEvent = (event) => {
  const today = new Date();
  const isCurrentMonth = isSameMonth(new Date(event.start), today);

  if (!isCurrentMonth) return;  // Do nothing if not current month

  setEditingEvent(event); // Open modal only for current month
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent(prev => ({ ...prev, [name]: value }));
  };

  const eventStyleGetter = (event) => {
    return {
      className: event.type === 'income' ? 'income-event' : 'expense-event'
    };
  };

  const handleUpdate = async () => {
  const email = localStorage.getItem("userEmail");

  try {
    await axios.patch(`http://localhost:5000/api/transactions/${editingEvent._id}`, {
      source: editingEvent.source,
      amount: editingEvent.amount,
      date: editingEvent.start,
      emoji: editingEvent.emoji,
      type: editingEvent.type,
      email: email  // ✅ ensure email remains attached
    });

    alert("Transaction updated");
    setEditingEvent(null);
    fetchTransactions();  // ✅ sync
    fetchSummary();       // ✅ sync
    loadEvents();         // ✅ refresh calendar
  } catch (err) {
    alert("Update failed");
  }
};


  return (
    <div style={{ height: '90vh', margin: '20px' }}>
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        views={['month']}
        defaultView="month"
        popup
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Transaction</h3>
            <input
              type="text"
              name="source"
              value={editingEvent.source}
              onChange={handleChange}
              placeholder="Source"
            />
            <input
              type="number"
              name="amount"
              value={editingEvent.amount}
              onChange={handleChange}
              placeholder="Amount"
            />
            <input
              type="date"
              name="start"
              value={format(new Date(editingEvent.start), 'yyyy-MM-dd')}
              onChange={(e) => {
                const date = new Date(e.target.value);
                setEditingEvent({ ...editingEvent, start: date, end: date });
              }}
            />
            <div className="modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setEditingEvent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monthly;
