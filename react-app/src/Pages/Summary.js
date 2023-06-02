import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Toast from 'react-bootstrap/Toast';
import CloseButton from 'react-bootstrap/CloseButton';

function SummaryPage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [summary, setSummary] = useState('');
  
  const goToHome = () => { 
    navigate("/");
  }

  useEffect(() => {
    const data = location.state.a;
    setSummary(data);
  }, []);

  const [tooltipStyle, setTooltipStyle] = useState({});
  const [translatedText, setTranslatedText] = useState('');

  const handledifficulty = async (difficulty) => {
    const response = await fetch(`http://localhost:5010/api/difficulty`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty })
    });
    const data = await response.json();
    console.log(data.result);
    //setSummary(data.result);
  };

  const handleTranslate = async (event) => {
    console.log("mouseup");
    const selectedText = window.getSelection().toString();
    console.log(selectedText);
    if (selectedText) {
      const response = await fetch(`http://localhost:5010/api/translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: selectedText })
      });

      const data = await response.json();
      console.log(data.result);
      setTranslatedText(data.result);
      setTooltipStyle({
        display: 'block',
        position: 'fixed',
        top: event.clientY + 'px',
        left: event.clientX + 'px',
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
      <Card border="dark">
      <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
      <Card.Body>
      {summary && (
          <div>
        <Card.Header className="text-center">Summary</Card.Header>
        <Card.Text onMouseUp={handleTranslate}>{summary}</Card.Text>
        {translatedText && (
          <Toast style={tooltipStyle} border>
            <Toast.Header closeButton={false}>
              <strong className="m-auto">Translated Text</strong>
              <CloseButton onClick={handleTranslatedTextClick}/>
            </Toast.Header>
            <Toast.Body className="m-auto">{translatedText}</Toast.Body>
          </Toast>
          )}
          <ButtonGroup className="d-flex">
          <Button variant="info" onClick={() => handledifficulty("easy")}>Low</Button>
          <Button variant="dark">Middle</Button>
          <Button variant="danger" onClick={() => handledifficulty("hard")}>High</Button>
          </ButtonGroup>
          </div>
      )}
      </Card.Body>
      </Card>
    </div>
  );
}

export default SummaryPage;