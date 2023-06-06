import React from "react";
import { useNavigate } from "react-router-dom";
//import Button from '../components/Button';
import { Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';

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
  const goToJoin = () => { 
    navigate("/Join");
  }

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

      if (result.success) {
        // 로그인 성공
        document.cookie = `uid=${result.uid}`;
        navigate("/");
      } else {
        // 로그인 실패
        alert(result.message);
      }
    };

  return (
    <div>
        <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
        <Nav.Link onClick={goToJoin}>Create Account</Nav.Link>
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