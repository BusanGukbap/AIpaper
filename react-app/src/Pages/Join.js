import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import CloseButton from 'react-bootstrap/CloseButton';

function JoinPage({}) {
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

        if (result.success) {
            // 회원가입 성공
            navigate("/login");
        } 
        else {
            // 회원가입 실패
            alert(result.message);
        }
    };

    return(
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
            <Col xs={12} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '0px' }}>
                <h1>Sign Up</h1>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  handleSignUp(event.target.id.value, event.target.pw.value);
                }}>
                  <input type="text" name="id" placeholder="ID" style={{ width: '400px', height: '50px', fontSize: '20px', marginBottom: '15px' }} />
                  <br />
                  <input type="password" name="pw" placeholder="PW" style={{ width: '400px', height: '50px', fontSize: '20px', marginBottom: '15px' }} />
                  <br />
                  <Button type="submit" style={{ width: '150px', height: '50px', fontSize: '20px' }}>Sign Up</Button>
                </form>
              </div>
              <div>
                <Button type="submit" onClick={goToHome} variant="light" style={{ marginRight: '15px' }}>Home</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
}

export default JoinPage;