import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, ButtonGroup, Card, Toast, CloseButton, Alert } from 'react-bootstrap';

function SummaryPage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null)

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
    <div>
      <Card border="dark" ref={cardRef}>
      <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
      <Card.Body>
      {text ? (
          <div>
        <Card.Header className="text-center">Summary</Card.Header>
        <Card.Text onMouseUp={handleTranslate}>{text}</Card.Text>
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
      ):
      <Alert variant="danger" >
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          The article you selected is not available.
        </p>
        </Alert>}
      </Card.Body>
      </Card>
    </div>
  );
}

export default SummaryPage;