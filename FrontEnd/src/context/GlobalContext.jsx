import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [summary, setSummary] = useState({
    overallbalance: 0,
    mincome: 0,
    mexpense: 0,
    mbalance: 0,
  });

  const [transactions, setTransactions] = useState([]);

  const userEmail = localStorage.getItem("userEmail"); //  get email from localStorage

 const fetchSummary = async () => {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  try {
    const res = await axios.get(`http://localhost:5000/api/summary?email=${email}`);
    setSummary(res.data);
  } catch (err) {
    console.error("Error fetching summary:", err);
  }
};


  const fetchTransactions = async () => {
  const email = localStorage.getItem("userEmail");  // 👈 Add this
  if (!email) return;

  try {
    const res = await axios.get(`http://localhost:5000/api/transactions?email=${email}`);
    setTransactions(res.data);
  } catch (err) {
    console.error("Error fetching transactions:", err);
  }
};


  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [userEmail]); // re-run if email changes

  return (
    <GlobalContext.Provider value={{
      summary,
      transactions,
      fetchSummary,
      fetchTransactions
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
