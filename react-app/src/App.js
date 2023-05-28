import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
};

export default App;