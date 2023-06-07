import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Join from './Pages/Join';
import Title from './Pages/Title';
import Summary from './Pages/Summary';
import History from './Pages/HistoryPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} /> 
      <Route path="/join" element = {<Join />} />
      <Route path="/title" element = {<Title />} />
      <Route path="/summary" element = {<Summary/>} />
      <Route path="/history" element = {<History/>} />
    </Routes>
  );
};

export default App;