import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, ButtonGroup, Card, Toast, CloseButton, Alert, Spinner, Row, Col } from 'react-bootstrap';

function SummaryPage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null)

  const [isSpinner, setIsSpinner] = useState(false);
  const [summary, setSummary] = useState('');
  const [easy, setEasy] = useState('');
  const [normal, setNormal] = useState('');
  const [hard, setHard] = useState('');
  const [text, setText] = useState('');
  

  const goToHome = () => { 
    navigate("/");
  }

  useEffect(() => {
    const data = location.state.a;
    setText(data.summary)
    setSummary(data.summary);
    setEasy(data.difficulty.easy);
    setNormal(data.difficulty.normal);
    setHard(data.difficulty.hard);
  }, []);

  const [tooltipStyle, setTooltipStyle] = useState({});
  const [translatedText, setTranslatedText] = useState('');
  const [inputValue, setInputValue] = useState('');

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

  const handledifficulty = async (difficulty) => {
    switch(difficulty){
      case "origin":
        setText(summary);
        break;
      case "easy":
        setText(easy);
        break;
      case "normal":
        setText(normal);
        break;
      case "hard":
        setText(hard);
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
      const response = await fetch(`http://localhost:5010/api/translation`, {
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
      <Col xs={12} md={{ span: 10, offset: 1}} lg={{ span: 8, offset: 2}}>
        <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
          <form onSubmit={handleSubmit}  style = {{ display : 'flex', alignItems: 'center'}}>          
            <input type="text" style={{ width: '400px', height: '50px', fontSize: '20px',marginRight: '15px',marginBottom: '5px'}} onChange={handleInputChange} value = {inputValue}/>
            {isSpinner?
              <Spinner variant="primary" animation="border" style={{  width: '35px', height: '35px'}} /> :
              <Button type="submit" style={{ width: '150px', height: '50px', fontSize: '20px', marginBottom: '5px' }}>Search</Button>}
            </form>
        <Card border="dark" ref={cardRef}>
          <Card.Body>
          {text ? (
            <div>
              <Card.Header className="text-center" style={{height: '5vh'}}>Summary</Card.Header>
              <Card.Text onMouseUp={handleTranslate} style={{height: '40vh', overflow: 'auto'}}>{text}</Card.Text>
                {translatedText && (
                  <Toast border style={{
                    ...tooltipStyle,
                    width: cardRef.current ? cardRef.current.offsetWidth - (cardRef.current.offsetWidth / 4): 'auto',
                  }}>
                    <Toast.Header closeButton={false}>
                      <strong className="m-auto">Translated Text</strong>
                      <CloseButton onClick={handleTranslatedTextClick}/>
                    </Toast.Header>
                    <Toast.Body className="m-auto">{translatedText}</Toast.Body>
                  </Toast>
                )}
              <ButtonGroup className="d-flex">
                <Button variant="secondary" onClick={() => handledifficulty("origin")}>Origin</Button>
                <Button variant="info" onClick={() => handledifficulty("easy")}>Easy</Button>
                <Button variant="dark" onClick={() => handledifficulty("normal")}>Normal</Button>
                <Button variant="danger" onClick={() => handledifficulty("hard")}>Hard</Button>
              </ButtonGroup>
            </div>
          ) : 
            <Alert variant="danger" >
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  The article you selected is not available.
                </p>
            </Alert>}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default SummaryPage;