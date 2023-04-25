import React, { useState } from 'react';
import Button from './Button';
import InputBox from './InputBox';
import OutputBox from './OutputBox';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [headlines, setHeadlines] = useState([]);
  const [summary, setSummary] = useState('');
  const [url, seturl] = useState('');

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
    setSummary('');
    seturl(data.url);
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
      body: JSON.stringify({ 
        index:index,
        url : url[index]
        })
    });
//    setSummary('123456789'); 
    const data = await response.json();
    setSummary(data.summary);
  }

  return (
    <div>
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
          {headlines.map((headline, index) => (
            <tr key={headline}>
              <td>{index + 1}</td>
              <td onClick={() => handleHeadlineClick(index)}>{headline}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {summary && (
        <div>
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;