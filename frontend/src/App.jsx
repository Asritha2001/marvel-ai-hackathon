import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Pages/Signup'; // Ensure correct path to the Signup component
// import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
