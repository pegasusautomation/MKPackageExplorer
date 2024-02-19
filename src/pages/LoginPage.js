import React, { useState } from "react";
import "./login.css";
import { useHistory } from "react-router-dom";

const LoginPage = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    // const [role, setRole] = useState('user');
    // const [details, setData] = useState('');
    let data = [];
    const history = useHistory();
    const handleSubmit =  async (e) => {
        
        onLogin(email, password);
        data = [
            {
                User: email,
                LoggedInDate: new Date().toString(),
            }
          ]
          // try {
          //   // Call the login method from AuthService
          //   await AuthService.login(email, password);
          // console.log("hello");
          //   // Redirect or perform any other necessary actions
          // } catch (error) {
          //   console.log("hello world");
          //   console.error('Login failed:', error.message);
          // }
           // Store user login data to google sheet
           try {
            const res = await fetch(
              "https://sheet.best/api/sheets/da498c34-41c5-452d-bb1f-a8dab2e5ea4a",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              }
            );
            if (res.ok) {
              history.replace("/");
            } 
        } catch (error) {
                console.log(error);
              }
            }

    
 
    return (
        <div className="auth-form-container">
        <h2>MediaKind</h2>
        <form className="login-form" onSubmit={handleSubmit}>
        <br></br>
            {/* <label htmlFor="email">email</label> */}
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="Username" id="email" name="email"/>           
            {/* <label htmlFor="password">password</label> */}
            <br></br>
            <br></br>
            <input value={password} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <br></br>
            <br></br>
            <button type="submit" >Log In</button>
        </form>
    </div>
)
};

export default LoginPage;