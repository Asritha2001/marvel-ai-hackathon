import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

const SessionHistory = () => {
    const [currentLesson, setCurrentLesson] = useState(null);
    const [sessionHistory, setSessionHistory] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }
            try {
                console.log("Tried");
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [navigate]);

    const handleGenerateNewPrompt = () => {
        navigate('/homepage');
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
                                isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/sessionhistory"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg ${
                                isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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

            <div className="flex gap-6 p-4">
                {/* Left Section: Current Lesson */}
                <div className="w-1/2 bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Current Lesson</h2>
                    {currentLesson ? (
                        <div className="border border-purple-500 rounded-lg p-4">
                            <h3 className="text-lg font-bold">{currentLesson.title}</h3>
                            <ul className="list-disc list-inside text-gray-300">
                                {currentLesson.takeaways.map((takeaway, index) => (
                                    <li key={index}>{takeaway}</li>
                                ))}
                            </ul>
                            <button
                                className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                onClick={() => alert('Resume Lesson clicked!')}
                            >
                                Resume Lesson
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400">You haven’t started a lesson yet.</p>
                    )}
                    <button
                        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        onClick={handleGenerateNewPrompt}
                    >
                        Generate New Prompt
                    </button>

                </div>

                {/* Right Section: Session History */}
                <div className="w-1/2 bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Session History</h2>
                    {sessionHistory.length > 0 ? (
                        <div className="border border-purple-500 rounded-lg overflow-y-auto max-h-96">
                            <table className="w-full text-left text-gray-300">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b border-gray-600">Title</th>
                                        <th className="px-4 py-2 border-b border-gray-600">Date Launched</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionHistory.map((session, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-b border-gray-700">
                                                {session.title}
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-700">
                                                {new Date(session.dateLaunched).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-400">No session history available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SessionHistory;
