import React from "react";
import { useNavigate, Link } from "react-router-dom";
//import Button from '../components/Button';
import { Button } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import CloseButton from 'react-bootstrap/CloseButton';

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
    navigate("/join");
  }

  // 로그인
  const handleSignIn = async (id, pw) => {
      const response = await fetch('http://34.64.206.236:5010/api/sign_in', {
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
        document.cookie = `session_id=${result.uid}; SameSite=None; Secure`;
        navigate("/");
      }
      else {
        // 로그인 실패
        alert(result.message);
      }
    };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container>
        <Row>
          <Col xs={12}>
            <h1 style={{ fontSize: 100, textAlign: 'center', marginBottom: '40px' }}>
              <Link style={{ color: 'black', textDecoration: 'none' }} to="/">AIpaper</Link>
            </h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} style={{ textAlign: 'center' }}>
            <h1>Sign In</h1>
            <form onSubmit={(event) => {
              event.preventDefault();
              handleSignIn(event.target.id.value, event.target.pw.value);
            }}>
              <input type="text" name="id" placeholder="ID" style={{ width: '400px', height: '50px', fontSize: '20px', marginBottom: '15px' }} />
              <br />
              <input type="password" name="pw" placeholder="PW" style={{ width: '400px', height: '50px', fontSize: '20px', marginBottom: '15px' }} />
              <br />
              <Button type="submit" style={{ width: '150px', height: '50px', fontSize: '20px', marginBottom: '15px' }}>Sign In</Button>
            </form>
            <Button type="submit" onClick={goToHome} variant="light" style={{ marginRight: '15px' }}>Home</Button>
            <Button type="submit" onClick={goToJoin} variant="light">Create Account</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;