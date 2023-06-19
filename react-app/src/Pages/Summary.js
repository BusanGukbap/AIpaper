import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, ButtonGroup, Card, Toast, CloseButton, Alert, Spinner, Row, Col, Nav } from 'react-bootstrap';

function SummaryPage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null)
  const [title, setTitle] = useState('Summary');

  const [isSpinner, setIsSpinner] = useState(false);
  const [summary, setSummary] = useState('');
  const [easy, setEasy] = useState('');
  const [normal, setNormal] = useState('');
  const [hard, setHard] = useState('');
  const [text, setText] = useState('');
  const [paperLink, setPaperLink] = useState('');
  

  const goToHome = () => { 
    navigate("/");
  }
  const goToLogout = async(event) => {
    const response = await fetch(`https://34.64.206.236:5010/api/sign_out`, {
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
    const response = await fetch(`https://34.64.206.236:5010/api/history`, {
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
  const goToLogin = () => {
    navigate("/login");
  }

  useEffect(() => {
    const data = location.state.a;
    setText(data.summary)
    setSummary(data.summary);
    setEasy(data.difficulty.easy);
    setNormal(data.difficulty.normal);
    setHard(data.difficulty.hard);
    setPaperLink(location.state.b);
  }, []);

  const [tooltipStyle, setTooltipStyle] = useState({});
  const [translatedText, setTranslatedText] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputValue);
    setIsSpinner(true);
    const response = await fetch(`https://34.64.206.236:5010/api/article?keyword=${inputValue}`);
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

  const handledifficulty = async (difficulty) => {
    switch(difficulty){
      case "Summary":
        setText(summary);
        setTitle('Summary');
        break;
      case "easy":
        setText(easy);
        setTitle('Easy');
        break;
      case "normal":
        setText(normal);
        setTitle('Normal');
        break;
      case "hard":
        setText(hard);
        setTitle('Hard');
        break;
    }
  };

  const handleTranslate = async (event) => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const top = rect.bottom;
    if (selectedText) {
      const response = await fetch(`https://34.64.206.236:5010/api/translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedText })
      });
      const data = await response.json();
      setTranslatedText(data.result);
      setTooltipStyle({
        display: 'block',
        position: 'fixed',
        zIndex: 9999,
        top: top + 'px',
        backgroundColor: 'white',
        opacity: 1,
      });
      
    }
  };

  const handleTranslatedTextClick = () => {
    setTranslatedText('');
    setTooltipStyle({});
  };

  return(
  <Row>
    <Col xs={12} md={{ span: 10, offset: 1}} lg={{ span: 8, offset: 2}} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: 63, textAlign: 'center', marginBottom: '20px', marginTop: '20px' } }>
              <Link style ={{color : 'black', textDecoration : 'none'}} to = "/">AIpaper</Link>
          </h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <input type="text" style={{ width: '400px', height: '50px', fontSize: '20px',marginRight: '15px',marginBottom: '5px' }} onChange={handleInputChange} value={inputValue} />
        {isSpinner ? (
          <Spinner variant="primary" animation="border" style={{ width: '35px', height: '35px' }} />
        ) : (
          <Button type="submit" style={{ width: '15vh', height: '5vh', fontSize: '20px', marginBottom: '5px' }}>Search</Button>
        )}
      </form>
            <Nav defaultActiveKey="/" className="justify-content-center">
              { document.cookie.length ? (
                <Nav.Link onClick={goToLogout}>Logout</Nav.Link>
              ) : (
                <Nav.Link onClick={goToLogin}>Login</Nav.Link>
              )}
              <Nav.Link eventKey="link-2" disabled>UserInfo</Nav.Link>
              <Nav.Link onClick={goToHistory}>History</Nav.Link>
            </Nav>
      <Card border="dark" ref={cardRef}>
        <Card.Body>
          {text ? (
            <div>
              <Card.Header className="text-center" style={{ height: '40px' }}>{title}</Card.Header>
              <Card.Text onMouseUp={handleTranslate} style={{ height: '40vh', overflow: 'auto' }}>{text}</Card.Text>
              {translatedText && (
                <Toast border style={{
                  ...tooltipStyle,
                  width: cardRef.current ? cardRef.current.offsetWidth - (cardRef.current.offsetWidth / 4) : 'auto',
                }}>
                  <Toast.Header closeButton={false}>
                    <strong className="m-auto">Translated Text</strong>
                    <CloseButton onClick={handleTranslatedTextClick} />
                  </Toast.Header>
                  <Toast.Body className="m-auto">{translatedText}</Toast.Body>
                </Toast>
              )}
              <Button onClick = {() => window.open(paperLink, "_blank")} className="w-100" >{paperLink}</Button>
              <ButtonGroup className="d-flex" style={{marginTop: '10px'}}>
                <Button variant="secondary" onClick={() => handledifficulty("Summary")}>Summary</Button>
                <Button variant="info" onClick={() => handledifficulty("easy")}>Easy</Button>
                <Button variant="dark" onClick={() => handledifficulty("normal")}>Normal</Button>
                <Button variant="danger" onClick={() => handledifficulty("hard")}>Hard</Button>
              </ButtonGroup>
            </div>
          ) : (
            <Alert variant="danger" >
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                The article you selected is not available.
              </p>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Col>
  </Row>
  );
}

export default SummaryPage;