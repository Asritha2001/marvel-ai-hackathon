import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import Swal from 'sweetalert2';

const HomePage = () => {
    const [userName, setUserName] = useState('');
    const [errors, setErrors] = useState({});
    const [isComplete, setIsComplete] = useState(false);

    const [formData, setFormData] = useState({
        experience: '',
        preferredLang: '',
        learningGoals: '',
        additionalInfo: '',
    });
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                handleLogout();
                return;
            }
            try {
                const response = await axiosInstance.get(`/getUserData/${userId}`);
                setUserName(response.data.user.username);
            } catch (error) {
                console.error("Error fetching user data", error);
                handleLogout();
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleGeneratePrompt = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        if (!formData.experience) {
            validationErrors.experience = 'Please select your experience level.';
        }
        if (!formData.preferredLang) {
            validationErrors.preferredLang = 'Please select a coding language.';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        console.log(formData);
        try {
            alert('prompt generated sucessfully');
            // const userId = localStorage.getItem('userId');
            // const response = await axiosInstance.post(`/generatePrompt/${userId}`, formData);
            setFormData({
                experience: '',
                preferredLang: '',
                learningGoals: '',
                additionalInfo: '',
            });
            setIsComplete(false);
            setErrors({});
        }
        catch (error) {
            alert('Failed to generate prompt. Please try again.');
        }
    };

    const handleMarkAsComplete = async (e) => {
        setIsComplete(true);
        Swal.fire({
            title: '🎉 Lesson Completed!',
            text: 'Great job! Keep up the good work.',
            icon: 'success',
            confirmButtonText: 'Awesome',
            confirmButtonColor: '#6b46c1',
        });
        console.log("Marked");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 bg-gray-800">
                <div className="flex gap-4">
                    <NavLink
                        to="/homepage"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg ${
                                isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/sessions"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg ${
                                isActive ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`
                        }
                    >
                        Session History
                    </NavLink>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex p-4 gap-4">
                <div className="w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold mb-4">Hello {userName}, Start Learning Coding</h2>

                        {/* Form for Generate Prompt */}
                        <form onSubmit={handleGeneratePrompt}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Experience Level*</label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                                >
                                    <option value="">Choose</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                {errors.experience && (
                                    <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Coding Language*</label>
                                <select
                                    name="preferredLang"
                                    value={formData.preferredLang}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                                >
                                    <option value="">Choose</option>
                                    <option value="python">Python</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="java">Java</option>
                                    <option value="c++">C++</option>
                                </select>
                                {errors.preferredLang && (
                                    <p className="text-red-500 text-sm mt-1">{errors.preferredLang}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-sm">What do you want to learn?*</label>
                                <textarea
                                    name="learningGoals"
                                    value={formData.learningGoals}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                                    placeholder="Describe what you want to learn..."
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Anything else I should know?</label>
                                <textarea
                                    name="additionalInfo"
                                    value={formData.additionalInfo}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                                    placeholder="Add any additional information..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="bg-purple-500 px-3 py-2 rounded-lg hover:bg-purple-700 w-full"
                            >
                                Generate Prompt
                            </button>
                        </form>
                    </div>

                    <div className="mt-4">
                            <button
                                className={`px-3 py-2 rounded-lg w-full ${
                                    isComplete
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-700'
                                }`}
                                onClick={handleMarkAsComplete}
                                disabled={isComplete}
                            >
                            Mark as Complete
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-purple-300 p-4 rounded-lg shadow-lg flex items-center justify-center">
                    <h2 className="text-lg font-bold text-gray-800">Interactive coding activity area is here</h2>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
