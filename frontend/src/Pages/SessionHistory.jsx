import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

const SessionHistory = () => {
    const [sessionHistory, setSessionHistory] = useState([]);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    useEffect(() => {
        const fetchSessionHistory = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }
            try {
                console.log("calling api");
                const response = await axiosInstance.get(`/getSessionbyID/${userId}`);
                console.log("response", response);
                console.log('Session history:', response.data.data);
                setSessionHistory(response.data.data); // Set the retrieved data in the state
            } catch (error) {
                console.error('Error fetching session history:', error);
                if (error.response && error.response.status === 404) {
                    setSessionHistory([]); // If no sessions are found, clear the history
                }
            }
        };

        fetchSessionHistory();
    }, [navigate]);

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

            <div className="flex justify-center p-4">
                {/* Session History */}
                <div className="w-full max-w-3xl bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Session History</h2>
                    {sessionHistory.length > 0 ? (
                        <div className="border border-purple-500 rounded-lg overflow-y-auto max-h-96">
                            <table className="w-full text-left text-gray-300">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b border-gray-600">Experience</th>
                                        <th className="px-4 py-2 border-b border-gray-600">Language</th>
                                        <th className="px-4 py-2 border-b border-gray-600">Learning Goal</th>
                                        <th className="px-4 py-2 border-b border-gray-600">Date Launched</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionHistory.map((session, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-b border-gray-700">
                                                {session.experience || 'Untitled Session'}
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-700">
                                                {session.language || 'Untitled Session'}
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-700">
                                                {session.expertise || 'Untitled Session'}
                                            </td>
                                            <td className="px-4 py-2 border-b border-gray-700">
                                                {new Date(session.time).toLocaleString()}
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
