import React, { useState } from 'react';
import axiosInstance from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/image.png';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/login', formData);
      const { user } = response.data;
      localStorage.setItem('userId', user._id);
      setSuccessMessage(response.data.message || 'Login Successful!');
      setErrorMessage('');
      setFormData({ username: '', password: '' });
      navigate('/homepage');
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Something went wrong!');
      setSuccessMessage('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-2">
      <div className="text-center mb-6">
        <img src={image} alt="Logo" className="w-20 h-20 mx-auto" />
        <h1 className="text-3xl font-bold text-white">Marvel AI</h1>
        <p className="text-base font-medium text-gray-400">The world is your canvas</p>
      </div>

      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-4">Login</h2>
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200" htmlFor="username">
              Username/Email:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-200" htmlFor="password">
              Password:
            </label>
            <div className="flex items-center w-full mt-1 border border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-purple-600 bg-gray-700">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 px-4 py-2 bg-gray-700 text-white focus:outline-none rounded-l-lg"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="px-3 text-gray-400 hover:text-white focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12m0 0a3 3 0 11-6 0 3 3 0 016 0zm3.458 2.042A10.05 10.05 0 0121 12c-1.667 2.667-4.333 4-8 4s-6.333-1.333-8-4a10.05 10.05 0 012.542-2.958M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.5c3.315 0 6.16 1.855 7.545 4.5C18.16 12.145 15.315 14 12 14s-6.16-1.855-7.545-4.5C5.84 6.355 8.685 4.5 12 4.5zm0 1.5a3 3 0 11-.001 5.999A3 3 0 0112 6zm7.636 7.964a10.049 10.049 0 01-7.636 3.536c-2.762 0-5.236-1.166-7.108-3.122m14.744 0L21 20.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Login
          </button>
        </form>
        <p className="text-m text-center text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
