
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="sidebar">
      <nav className="nav-links">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/income" className="nav-link">Income</Link>
        <Link to="/expense" className="nav-link">Expense</Link>
        <Link to="/transaction" className="nav-link">Transaction</Link>
        <Link to="/Monthly" className="nav-link">Monthly</Link>
        <Link to="/login" className='nav-link'>Logout</Link>
      </nav>
    </div>
  );
};

export default Navbar;
