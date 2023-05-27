import React, { useState } from 'react';
import Button from '../components/Button';
import InputBox from '../components/InputBox';
import OutputBox from '../components/OutputBox';
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [articles, setArticles] = useState([]);
  const [summary, setSummary] = useState(`A "counter-terrorist operation" was ongoing in southwestern Russia's Belgorod region, its governor said Tuesday, a day after a town bordering Ukraine was attacked in an incursion claimed by pro-Ukraine Russian nationals.

  “The Defense Ministry continues to sweep the territory with the help of law enforcement agencies,” Belgorod Gov. Vyacheslav Gladkov said on Telegram.
  “All the necessary actions are being taken by the security forces. We are waiting for the completion of the counter-terrorist operation that was announced yesterday. I will try to update the information for you as quickly as possible.”
  Earlier, Gladkov said Belgorod was hit by drone attacks overnight, following an incursion Monday claimed by Russians partisans aligned with the Ukrainian army.
  
  The Freedom of Russia Legion and Russian Volunteer Corps earlier said they had "fully liberated the settlement of Kozinka" and "entered Grayvoron," after crossing from Ukraine into Belgorod on Monday.
  
  On Tuesday, Gladkov urged Grayvoron residents not to return to their homes until the operation was completed.`);

  const [trnaslatedText, setTranslatedText] = useState('');
  const [tooltipStyle, setTooltipStyle] = useState({});

  const goToLogin = () => { 
    navigate("/Login");
  }

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
    setSummary(data.result);
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
        opacity: 0.9,
      });
    }
  };
  const handleTranslatedTextClick = () => {
    setTranslatedText('');
    setTooltipStyle({});
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
      <Button type = "submit" text = "Login" onClick={goToLogin}/>

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
            <div style={tooltipStyle} onClick={handleTranslatedTextClick}>{trnaslatedText}</div>
          )}
          <button onClick={() => handledifficulty("easy")}>easy</button>
          <button onClick={() => handledifficulty("hard")}>hard</button>
        </div>
      )}
    </div>
  );
}

export default App;