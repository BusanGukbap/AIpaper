
import React, { useState } from 'react';
import Button from './Button';
import InputBox from './InputBox';
import OutputBox from './OutputBox';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [headlines, setHeadlines] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:5010/api/search_article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keyword: inputValue })
    });

    const data = await response.json();

    setHeadlines(data.headlines);
    setInputValue('');
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleHeadlineClick = async (index) => {
    const response = await fetch('http://localhost:5010/api/get_summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ index })
    });

    // handle the response from the Flask endpoint
  }

  return (
    <div>
      <h1> AIPaper </h1>
      <form onSubmit={handleSubmit}>
        <InputBox onChange={handleInputChange} value={inputValue} />
        <Button type="submit" text="키워드 전송" />
      </form>
      
      {headlines.map((headline, index) => (
        <p key={headline} onClick={() => handleHeadlineClick(index)}>{headline}</p>
      ))}
    </div>
  );
}

export default App;