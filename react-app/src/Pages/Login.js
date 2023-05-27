import React from "react";
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';

/**
 * 회원가입 페이지
 * @param {*} param0
 * @returns JSX.Element
 */

function LoginPage({ /* onSignUp, onSignIn */ }) {
    const navigate = useNavigate();

    const goToHome = () => { 
        navigate("/");
      }

    // 회원가입
    const handleSignUp = async (id, pw) => {
        const response = await fetch('http://localhost:5010/api/sign_up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, pw }),
        });
        const result = await response.json();
        console.log(result);
    };
    
    // 로그인
    const handleSignIn = async (id, pw) => {
        const response = await fetch('http://localhost:5010/api/sign_in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, pw }),
        });
        const result = await response.json();
        console.log(result);
      };

    return (
        <div>
            <Button type = "submit" text = "Home" onClick={goToHome}/>
            <h1> Sign Up </h1>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleSignUp(event.target.id.value, event.target.pw.value);
            }}>
                <input type="text" name="id" placeholder="ID" />
                <input type="password" name="pw" placeholder="PW" />
                <button type="submit">Sign Up</button>
            </form>

            <h1> Sign In </h1>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleSignIn(event.target.id.value, event.target.pw.value);
            }}>
                <input type="text" name="id" placeholder="ID" />
                <input type="password" name="pw" placeholder="PW" />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}

export default LoginPage;