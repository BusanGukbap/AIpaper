import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button, Row, Col, Nav, Container, Spinner } from 'react-bootstrap';

function Home() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isSpinner, setIsSpinner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [articles, setArticles] = useState([]);
  
  const goToHome = () => {
    navigate("/");
  }
  const goToLogin = () => {
    navigate("/login");
  }
  const goToLogout = async(event) => {
    const response = await fetch(`http://localhost:5010/api/sign_out`, {
      method: 'GET',
      credentials: 'include',
    });
    const result = await response.json();
    if (result.success){
      alert(result.message);
      navigate("/");
    }
    else{
      alert(result.message);
    }
  }
  const goToHistory = async(event) => {
    const response = await fetch(`http://localhost:5010/api/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    const result = await response.json();
    console.log(result);
    if (result.success){
      navigate("/history", {state : {a : result}})
    }
    else{
      alert(result.message);
    }
    
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputValue);
    setIsSpinner(true);
    const response = await fetch(`http://localhost:5010/api/article?keyword=${inputValue}`);
    const data = await response.json();

    setIsSpinner(false);
    //setArticles(data.articles);
    console.log(data.articles);
    //goToTitle();
    navigate("/title", {state : {data : data}});
    setInputValue('');
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container>
        <Row>
          <Col xs={12}>
            <h1 style={{ fontSize: 100, textAlign: 'center', marginBottom: '40px' } }>
              <Link style ={{color : 'black', textDecoration : 'none'}} to = "/">AIpaper</Link>
          </h1>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
              <input type="text" style={{ width: '400px', height: '50px', fontSize: '20px',marginRight: '15px',marginBottom: '5px'}} onChange={handleInputChange} value = {inputValue}/>
              {isSpinner?
               <Spinner variant="primary" animation="border" style={{  width: '35px', height: '35px'}} /> :
               <Button type="submit" style={{ width: '150px', height: '50px', fontSize: '20px', marginBottom: '5px' }}>Search</Button>}
            </form>
          </Col>
        </Row>
        <Row> 
          <Col xs={12}>
            <Nav defaultActiveKey="/" className="justify-content-center">
              <Nav.Link href="/">Home</Nav.Link>
              { document.cookie.length ? (
                <Nav.Link onClick={goToLogout}>Logout</Nav.Link>
              ) : (
                <Nav.Link onClick={goToLogin}>Login</Nav.Link>
              )}
              <Nav.Link eventKey="link-2" disabled>UserInfo</Nav.Link>
              <Nav.Link onClick={goToHistory}>History</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;