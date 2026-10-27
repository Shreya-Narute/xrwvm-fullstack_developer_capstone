
import React from "react";
import "./Register.css";

function Register() {
  return (
    <div className="container mt-5">
      <h2>Sign-up</h2>

      <form>
        <input type="text" name="userName" placeholder="Username" required />
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
        <input type="email" name="email" placeholder="email" required />
        <input type="password" name="password" placeholder="Password" required />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
