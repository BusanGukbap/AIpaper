import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Row, Col, Table, ButtonGroup, Card, Placeholder, Alert, Spinner, Pagination, Nav } from 'react-bootstrap';

function TitlePage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSpinner, setIsSpinner] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const goToHome = () => {
    navigate("/");
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
  const goToLogin = () => {
    navigate("/login");
  }

  useEffect(() => {
    const data = location.state.data;
    setArticles(data.articles);
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(Number(event.target.text));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputValue);
    setIsSpinner(true);
    const response = await fetch(`http://localhost:5010/api/article?keyword=${inputValue}`);
    const data = await response.json();
    
    setIsSpinner(false);
    //setArticles(data.articles);
    console.log(data.articles);
    // title.js에서 바로 검색결과를 보여줄 수 있으므로 setArticles를 사용
    setArticles(data.articles);
    setInputValue('');
  };
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleHeadlineClick = async (article) => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:5010/api/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
      credentials: 'include',
    });
    
    const result = await response.json();
    setIsLoading(false);
    navigate("/summary", {state : {a : result}})
    console.log(result);
  };

  return(
  <div>
    <Row>
    <Col xs={12} md={{ span: 10, offset: 1}} lg={{ span: 8, offset: 2}} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: 63, textAlign: 'center', marginBottom: '20px', marginTop: '20px' } }>
              <Link style ={{color : 'black', textDecoration : 'none'}} to = "/">AIpaper</Link>
          </h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <input type="text" style={{ width: '400px', height: '50px', fontSize: '20px',marginRight: '15px',marginBottom: '5px' }} onChange={handleInputChange} value={inputValue} />
        {isSpinner ? (
          <Spinner variant="primary" animation="border" style={{ width: '35vh', height: '35vh' }} />
        ) : (
          <Button type="submit" style={{ width: '15vh', height: '5vh', fontSize: '20px', marginBottom: '5px' }}>Search</Button>
        )}
      </form>
            <Nav defaultActiveKey="/" className="justify-content-center">
              { document.cookie.length ? (
                <Nav.Link >LogOut</Nav.Link>
              ) : (
                <Nav.Link onClick={goToLogin}>Login</Nav.Link>
              )}
              <Nav.Link eventKey="link-2" disabled>UserInfo</Nav.Link>
              <Nav.Link onClick={goToHistory}>History</Nav.Link>
            </Nav>
        {isLoading ? (
          <div>
            <Card border="dark">
              <Card.Body>
                <Placeholder as={Card.Header} animation="wave">
                  <Placeholder style={{ width: '100%', height: '40px' }} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="wave">
                  <Placeholder style={{ width: '100%', height: '40vh' }} />
                </Placeholder>
                <ButtonGroup className="d-flex">
                  <Placeholder.Button variant="secondary" />
                  <Placeholder.Button variant="info" />
                  <Placeholder.Button variant="dark" />
                  <Placeholder.Button variant="danger" />
                </ButtonGroup>
              </Card.Body>
            </Card>
            <Alert variant="info">
              내용을 불러오는 데 약 30초 정도 걸립니다. 잠시만 기다려 주세요.
            </Alert>
          </div>
        ) : (
          <>
            <div style={{ height: '70vh', overflowX: 'auto' }}>
              <Table striped border hover>
                <colgroup>
                  <col style={{ width: '25px' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Headline</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArticles.map((article, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td onClick={() => handleHeadlineClick(article)}>{article.headline}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div>
              <Pagination>
                {[...Array(Math.ceil(articles.length / articlesPerPage)).keys()].map((page) => (
                  <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={handlePageClick}>
                    {page + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </>
        )}
      </Col>
    </Row>
  </div>
  );
}

export default TitlePage;