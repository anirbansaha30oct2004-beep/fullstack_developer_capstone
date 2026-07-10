import React, { useState } from 'react';
import "./Login.css";
import Header from '../Header/Header';

const Login = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  let login_url = window.location.origin + "/djangoapp/login/";

  const login = async (e) => {
    e.preventDefault();

    const res = await fetch(login_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": userName,
        "password": password
      }),
    });
    
    const json = await res.json();
    if (json.status != null && json.status === "Authenticated") {
      // Added fallback values to ensure your username session key maps correctly!
      const activeUser = json.userName || json.username;
      sessionStorage.setItem('username', activeUser);
      
      // ✅ Smoothly jump away from the login loop by forcing a clean context redirect
      window.location.href = window.location.origin;        
    }
    else {
      alert("The user could not be authenticated.");
    }
  };

  const handleCancel = () => {
    window.location.href = window.location.origin;
  };

  return (
    <div>
      <Header />
      <div>
        <div className='modalContainer'>
          <form className="login_panel" onSubmit={login}>
            <div>
              <span className="input_field">Username </span>
              <input type="text" name="username" placeholder="Username" className="input_field" onChange={(e) => setUserName(e.target.value)} required />
            </div>
            <div>
              <span className="input_field">Password </span>
              <input name="psw" type="password" placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)} required />            
            </div>
            <div>
              <input className="action_button" type="submit" value="Login"/>
              <input className="action_button" type="button" value="Cancel" onClick={handleCancel}/>
            </div>
            <a className="loginlink" href="/register">Register Now</a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;