import { useContext } from 'react';
import './Dashboard.css';
import Financialoverview from './Finacialoverview';
import TransactionList from './TransactionList';
import { GlobalContext } from '../../Context/GlobalContext';

const Dashboard = () => {
  const { summary } = useContext(GlobalContext);

  return (
    <div className="dashboard-container">
      {/* same card layout as before */}
      <div className="summary-cards">
        <div className="card overallbalance">
          <div className="card-header">
            <img src="/overallbalance.png" alt="Income Icon" className="icon-img" />
            <div className="card-text">
              <h3>Total Balance</h3>
              <p>₹ {summary.overallbalance}</p>
            </div>
          </div>
        </div>

        <div className="card mbalance">
          <div className="card-header">
            <img src="/balance.png" alt="Balance Icon" className="icon-img" />
            <div className="card-text">
              <h3>Balance</h3>
              <p>₹ {summary.mbalance}</p>
            </div>
          </div>
        </div>

        <div className="card mincome">
          <div className="card-header">
            <img src="/income.png" alt="Income Icon" className="icon-img" />
            <div className="card-text">
              <h3>Income</h3>
              <p>₹ {summary.mincome}</p>
            </div>
          </div>
        </div>

        <div className="card mexpense">
          <div className="card-header">
            <img src="/Expense.png" alt="Expense Icon" className="icon-img" />
            <div className="card-text">
              <h3>Expense</h3>
              <p>₹ {summary.mexpense}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-lower">
        <TransactionList />
        <Financialoverview
          income={summary.mincome}
          expense={summary.mexpense}
          balance={summary.mbalance}
        />
      </div>
    </div>
  );
};

export default Dashboard;
