import React, { useState } from 'react';
import Button from './Button';
import InputBox from './InputBox';
import OutputBox from './OutputBox';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [articles, setArticles] = useState([]);
  const [summary, setSummary] = useState(' this is a summary');

  const [trnaslatedText, setTranslatedText] = useState('');
  const [tooltipStyle, setTooltipStyle] = useState({});

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
      });
    }
    //setTranslatedText('');
    //setTooltipStyle({});
  };
  const handleClick = () => {
    setTranslatedText('');
    setTooltipStyle({});
  };

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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:5010/api/article?keyword=${inputValue}`);
    const data = await response.json();
    setArticles(data.articles);
    setInputValue('');
    setSummary('');
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleHeadlineClick = async (url) => {
    const response = await fetch(`http://localhost:5010/api/summary?url=${url}`);
    const data = await response.json();
    setSummary(data.summary);
  };
  return (
    <div>
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
      
      <h1> AIPaper </h1>
      <form onSubmit={handleSubmit}>
        <InputBox onChange={handleInputChange} value={inputValue} />
        <Button type="submit" text="키워드 전송" />
      </form>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Headline</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td onClick={() => handleHeadlineClick(article.url)}>{article.headline}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {summary && (
        <div>
          <h2>Summary</h2>
          <p onMouseUp={handleTranslate}>{summary}</p>
          {trnaslatedText && (
            <div style={tooltipStyle} onClick={handleClick}>{trnaslatedText}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;