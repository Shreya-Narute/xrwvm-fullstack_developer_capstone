
import React from 'react';
import '../assets/style.css';
import '../assets/bootstrap.min.css';

const Header = () => {
  const curr_user = sessionStorage.getItem('username');

  const logout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/djangoapp/logout', {
        method: 'GET',
      });

      if (response.ok) {
        sessionStorage.removeItem('username');
        window.location.href = '/login';
      } else {
        alert('Unable to log out. Please try again.');
      }
    } catch (error) {
      alert('Unable to connect to the server.');
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        backgroundColor: 'darkturquoise',
        minHeight: '1in',
      }}
    >
      <div className="container-fluid">
        <h2 style={{ paddingRight: '5%' }}>Dealerships</h2>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className="nav-link active"
                style={{ fontSize: 'larger' }}
                href="/"
              >
                Home
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={{ fontSize: 'larger' }}
                href="/dealers"
              >
                Dealers
              </a>
            </li>
          </ul>

          <div className="loginlink" id="loginlogout">
            {curr_user ? (
              <div className="input_panel">
                <span className="username">{curr_user}</span>
                <a className="nav_item" href="/djangoapp/logout" onClick={logout}>
                  Logout
                </a>
              </div>
            ) : (
              <div className="input_panel">
                <a className="nav_item" href="/login">
                  Login
                </a>
                {' | '}
                <a className="nav_item" href="/register">
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
