import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Row, Col, Table, ButtonGroup, Card, Placeholder, Alert, Spinner } from 'react-bootstrap';

function HistoryPage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSpinner, setIsSpinner] = useState(false);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const goToHome = () => {
    navigate("/");
  }
  
  useEffect(() => {
    const data = location.state.a;
    setArticles(data.history.articles);
  }, []);

  // 기사 제목 눌렀을 때 요약본 불러온 후 summary로 이동
  const handleHeadlineClick = async (article) => {
    setIsLoading(true);

    const response = await fetch(`http://localhost:5010/api/summary?url=${article.url}`, {
      method: 'GET',
    });

    console.log(1);
    const result = await response.json();

    setIsLoading(false);
    console.log(result);
    navigate("/Summary", {state : {a : result}});
  };

  return(
    <div>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
          {isLoading ? (
            <div>
              <Alert variant="info" >
                내용을 불러오는 데 약 30초 정도 걸립니다. 잠시만 기다려 주세요.
              </Alert>
              <Card border="dark">
                <Card.Body>
                  <Placeholder as={Card.Header} animation="wave">
                    <Placeholder style={{ width: '100%', height: '50px' }}/>
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder style={{ width: '100%', height: '500px' }}/>
                  </Placeholder>
                  <ButtonGroup className="d-flex">
                    <Placeholder.Button variant="info"/>
                    <Placeholder.Button variant="dark"/>
                    <Placeholder.Button variant="danger"/>
                  </ButtonGroup>
                </Card.Body>
              </Card>
            </div>
            ) : (
              <Table striped border hover>
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
                        <td onClick={() => handleHeadlineClick(article)}>{article.headline}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
    </div>
  );
}

export default HistoryPage;