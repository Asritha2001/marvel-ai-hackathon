import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup'; // Ensure correct path to the Signup component
import UserProfile from './Pages/UserData';
import Login from './Pages/Login';
import HomePage from './Pages/Homepage';
// import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
