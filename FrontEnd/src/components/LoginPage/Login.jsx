import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/login', {
        email: email.trim().toLowerCase(),
        password: password.trim()
      });

      toast.success(res.data.message);     
      navigate('/dashBoard');
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error); 
      } else {
        toast.error("Server error"); 
      }
    }
  };
  // console.log('working properly');
  console.log("Submitting to backend:", email.trim().toLowerCase(), password.trim());



  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <form className='auth-form' onSubmit={handleLogin}>
          <h1 className="auth-title">Login</h1>
          <div className='input-group'>
            <input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter the email'
              required
            />
          </div>
          <div className='input-group'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          <div className="link-small">Forget Password</div>
          <button className='auth-btn' type="submit">Login</button>
          <div className='auth-footer'>
            <p>Don't have an account? <button type="button" onClick={() => navigate('/SignUp')}>Register</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
