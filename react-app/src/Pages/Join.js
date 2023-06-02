import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
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
    };

    return(
        <div>
            <h1> Sign Up </h1>
        <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
            <form onSubmit={(event) => {
                event.preventDefault();
                handleSignUp(event.target.id.value, event.target.pw.value);
            }}>
                <input type="text" name="id" placeholder="ID" />
                <input type="password" name="pw" placeholder="PW" />
                <Button type="submit">Sign Up</Button>
            </form>
        </div>
    );
}

export default JoinPage;