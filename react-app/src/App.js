import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Join from './Pages/Join';
import Title from './Pages/Title';
import Summary from './Pages/Summary';
import MyPage from './Pages/MyPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} /> 
      <Route path="/Join" element = {<Join />} />
      <Route path="/Title" element = {<Title />} />
      <Route path="/Summary" element = {<Summary/>} />
      <Route path="/MyPage" element = {<MyPage />} />
    </Routes>
  );
};

export default App;