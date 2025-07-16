import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./components/LoginPage/Login";
import SignUp from "./components/LoginPage/SignUp";

import Income from './components/Income/Income';
import Expense from './components/Expense/Expense';
import Layout from "./components/Layout/Layout";
import Transaction from "./components/Transaction/Transaction";
import './index.css'
// import Monthly from "./components/Monthly/Monthly";

import Monthly from "./components/Monthly/Monthly";
// import Dashboard from "./components/Dashboard/Dashboard";

import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/transaction" element={<Transaction/>} />
          <Route path="/Monthly" element={<Monthly/>}/>
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

export default App;
