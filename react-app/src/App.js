import React, { useState } from 'react';
import Button from './Button';
import InputBox from './InputBox';
import LoginPage from './LoginPage';
import OutputBox from './OutputBox';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [articles, setArticles] = useState([]);
  const [summary, setSummary] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 키워드 전송 누름
  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:5010/api/search_article?keyword=${inputValue}`);
    const data = await response.json();
    setArticles(data.articles);
    setInputValue('');
    setSummary('');
  };
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  // 뉴스 헤드라인 클릭
  const handleHeadlineClick = async (url) => {
    const response = await fetch(`http://localhost:5010/api/get_summary?url=${url}`);
    const data = await response.json();
    setSummary(data.summary);
  };
  
  // 로그인 클릭
  const handleLoginClick = () => {
    setIsLoggedIn(false);
  }
  
  // 로그인 성공 시
  const handleSignIn = () => {
    setIsLoggedIn(true);
  }
  
  return (
    <div>
      {isLoggedIn ? (
        <>
          <button onClick={handleLoginClick}>Logout</button>
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
              <p>{summary}</p>
            </div>
          )}
        </>
      ) : (
        <LoginPage  onSignIn={handleSignIn} />
      )}
    </div>
  );
}

export default App;