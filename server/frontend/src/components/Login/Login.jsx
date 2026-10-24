
import React, { useState } from 'react';
import './Login.css';
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const login_url = '/djangoapp/login';

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(login_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
        }),
      });

      const json = await res.json();

      if (res.ok && json.status === 'Authenticated') {
        sessionStorage.setItem('username', json.userName);
        window.location.href = '/';
      } else {
        alert(json.error || 'Login failed. Check your username and password.');
      }
    } catch (error) {
      alert('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div>
      <Header />
      <div onClick={onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="modalContainer"
        >
          <form className="login_panel" onSubmit={login}>
            <div>
              <span className="input_field">Username </span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input_field"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div>
              <span className="input_field">Password </span>
              <input
                name="psw"
                type="password"
                placeholder="Password"
                className="input_field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                className="action_button"
                type="submit"
                value={loading ? 'Logging in...' : 'Login'}
                disabled={loading}
              />
              <input
                className="action_button"
                type="button"
                value="Cancel"
                onClick={() => {
                  setOpen(false);
                  if (onClose) onClose();
                }}
              />
            </div>

            <a className="loginlink" href="/register">
              Register Now
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
