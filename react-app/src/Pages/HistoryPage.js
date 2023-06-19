import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Row, Col, Table, ButtonGroup, Card, Placeholder, Alert, Spinner, Pagination, Nav } from 'react-bootstrap';

function HistoryPage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const goToHistory = async(event) => {
    const response = await fetch(`http://34.64.206.236:5010/api/history`, {
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
    setArticles(data.history.articles);
  }, []);  

  const handlePageClick = (event) => {
    setCurrentPage(Number(event.target.text));
  };
  // 기사 제목 눌렀을 때 요약본 불러온 후 summary로 이동
  const handleHeadlineClick = async (article) => {
    setIsLoading(true);
    
    const response = await fetch(`http://34.64.206.236:5010/api/summary?url=${article.url}`, {
      method: 'GET',
    });

    console.log(article);
    
    const result = await response.json();
    setIsLoading(false);
    navigate("/summary", {state : {a : result, b : article.url}})
    console.log(result);
  };

  return(
    <div>
      <Row>
      <Col xs={12} md={{ span: 10, offset: 1}} lg={{ span: 8, offset: 2}} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: 63, textAlign: 'center', marginBottom: '20px', marginTop: '20px' } }>
              <Link style ={{color : 'black', textDecoration : 'none'}} to = "/">AIpaper</Link>
          </h1>
            <Nav defaultActiveKey="/" className="justify-content-center">
              { document.cookie.length ? (
                <Nav.Link >LogOut</Nav.Link>
              ) : (
                <Nav.Link onClick={goToLogin}>Login</Nav.Link>
              )}
              <Nav.Link eventKey="link-2" disabled>UserInfo</Nav.Link>
              <Nav.Link onClick={goToHistory } disabled>History</Nav.Link>
            </Nav>
          {isLoading ? (
            <div>
              <Card border="dark">
                <Card.Body>
                  <Placeholder as={Card.Header} animation="wave">
                    <Placeholder style={{ width: '100%', height: '40px' }}/>
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder style={{ width: '100%', height: '40vh' }}/>
                  </Placeholder>
                  <ButtonGroup className="d-flex">
                    <Placeholder.Button variant="secondary"/>
                    <Placeholder.Button variant="info"/>
                    <Placeholder.Button variant="dark"/>
                    <Placeholder.Button variant="danger"/>
                  </ButtonGroup>
                </Card.Body>
              </Card>
              <Alert variant="info" >
                내용을 불러오는 데 약 30초 정도 걸립니다. 잠시만 기다려 주세요.
              </Alert>
            </div>
            ) : (
              <>
              <div style={{height: '70vh', overflowX: 'auto'}}>
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
              {[...Array(Math.ceil(articles.length / articlesPerPage)).keys()].map((page) => ( //Array는 javascript에서 제공하는 배열 객체, Array(5)는 길이가 5인 배열을 생성
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

export default HistoryPage;