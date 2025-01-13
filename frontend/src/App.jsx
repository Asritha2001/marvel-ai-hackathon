import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup'; // Ensure correct path to the Signup component
import Login from './Pages/Login';
import HomePage from './Pages/Homepage';
import SessionHistory from './Pages/SessionHistory';
// import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/sessionhistory" element={<SessionHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
