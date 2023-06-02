import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

function TitlePage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);

  const goToHome = () => {
    navigate("/");
  }

  useEffect(() => {
    const data = location.state.data;
    setArticles(data.articles);
  }, []);

  const handleHeadlineClick = async (article) => {
    const response = await fetch(`http://localhost:5010/api/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    const result = await response.json();
    console.log(result);
    //setSummary(result.summary);
    //console.log(summary);
    navigate("/Summary", {state : {a : result.summary}})
  };

  return(
    <div>
      <Row>
          <Col md={{ span: 6, offset: 3 }}>
          <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
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
          </Col>
        </Row>
    </div>
  );
}

export default TitlePage;