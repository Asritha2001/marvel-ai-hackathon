import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup'; // Ensure correct path to the Signup component
import UserProfile from './Pages/UserData';
// import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/user" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
