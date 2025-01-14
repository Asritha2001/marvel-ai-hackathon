import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import Swal from 'sweetalert2';
import ReactMarkdown from 'react-markdown';

const HomePage = () => {
    const [userName, setUserName] = useState('');
    const [formData, setFormData] = useState({
        experience: '',
        preferredLang: '',
        learningGoals: '',
        prompt: '',
    });
    const [isLocked, setIsLocked] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false); // New state for tracking button status
    const navigate = useNavigate();

    const handleLogout = () => {
        if (generatedPrompt && isLocked) {
            localStorage.setItem(
                'unsavedLesson',
                JSON.stringify({
                    experience: formData.experience,
                    preferredLang: formData.preferredLang,
                    learningGoals: formData.learningGoals,
                    prompt: formData.prompt,
                    generatedPrompt,
                })
            );
        } else {
            localStorage.removeItem('unsavedLesson');
        }
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

            const unsavedLesson = localStorage.getItem('unsavedLesson');
            if (unsavedLesson) {
                const savedData = JSON.parse(unsavedLesson);
                setFormData({
                    experience: savedData.experience || '',
                    preferredLang: savedData.preferredLang || '',
                    learningGoals: savedData.learningGoals || '',
                    prompt: savedData.prompt || '',
                });
                setGeneratedPrompt(savedData.generatedPrompt || '');
                setIsLocked(true);
                return;
            }

            try {
                const response = await axiosInstance.get(`/getUserData/${userId}`);
                setUserName(response.data.user.username);
            } catch (error) {
                console.error('Error fetching user data:', error);
                handleLogout();
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isLocked && (name === 'experience' || name === 'preferredLang')) {
            Swal.fire({
                icon: 'warning',
                title: 'Action Not Allowed',
                text: 'You cannot change your experience level or preferred language until the lesson is marked as complete.',
                confirmButtonColor: '#6b46c1',
            });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleGeneratePrompt = async () => {
        if (!formData.experience || !formData.preferredLang || !formData.learningGoals) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Fields',
                text: 'Please fill in all the required fields: Experience, Coding Language, and What to Learn.',
                confirmButtonColor: '#6b46c1',
            });
            return;
        }
    
        setIsGenerating(true); // Set loading state
        Swal.fire({
            title: 'Loading Response...',
            text: 'Please wait while the response is being generated...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading(); // Start the loading animation
            },
        });
    
        try {
            const userId = localStorage.getItem('userId');
            await axiosInstance.put(`/updateUserData/${userId}`, {
                experience: formData.experience,
                preferredLanguages: formData.preferredLang,
                learningGoals: formData.learningGoals,
                prompt: formData.prompt,
            });
    
            const response = await axiosInstance.post(`/processUserDataWithGeminiAI/${userId}`, {
                experience: formData.experience,
                preferredLanguages: formData.preferredLang,
                learningGoals: formData.learningGoals,
                prompt: formData.prompt,
            });
    
            // Update generated prompt
            setGeneratedPrompt(response.data.result);
    
            // Save unsaved lesson data in localStorage
            localStorage.setItem(
                'unsavedLesson',
                JSON.stringify({
                    ...formData,
                    generatedPrompt: response.data.result,
                })
            );
    
            // Set locked state
            setIsLocked(true);
    
            // Close the loading modal and show success message
            Swal.fire({
                icon: 'success',
                title: 'Response Generated',
                text: 'Feel free to interact with the generated content!',
                confirmButtonColor: '#6b46c1',
            });
        } catch (error) {
            console.error('Error generating prompt:', error);
    
            // Show error modal
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to generate the prompt. Please try again.',
                confirmButtonColor: '#6b46c1',
            });
        } finally {
            setIsGenerating(false); // Reset loading state
        }
    };
    
    const handleMarkAsComplete = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User ID not found in localStorage');
            return;
        }
    
        try {
            // Show a loading animation
            Swal.fire({
                title: 'Marking Lesson as Complete...',
                text: 'Please wait while the lesson is being processed.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading(); // Start the loading animation
                },
            });
    
            // Call the AI endpoint to process the lesson and mark it as complete
            const aiResponse = await axiosInstance.post(`/processUserDataWithGeminiAI/${userId}`, {
                experience: formData.experience,
                preferredLanguages: formData.preferredLang,
                learningGoals: formData.learningGoals,
                prompt: formData.prompt,
                completedLesson: true, // Ensure completedLesson is set to true
            });
    
            if (aiResponse.status === 200) {
                // Proceed with marking the session as complete
                await axiosInstance.post(`/createSession/${userId}`, {
                    experience: formData.experience,
                    language: formData.preferredLang,
                    expertise: formData.learningGoals,
                });
    
                // Close the loading animation and show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Lesson Completed',
                    text: 'Great job! Your lesson has been marked as complete.',
                    confirmButtonColor: '#6b46c1',
                });
    
                // Reset the form and remove the unsaved lesson data
                setFormData({
                    experience: '',
                    preferredLang: '',
                    learningGoals: '',
                    prompt: '',
                });
                setGeneratedPrompt('');
                setIsLocked(false);
                localStorage.removeItem('unsavedLesson');
            }
        } catch (error) {
            console.error('Error marking lesson as complete:', error);
    
            // Close the loading animation and show error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to mark the lesson as complete. Please try again.',
                confirmButtonColor: '#6b46c1',
            });
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <nav className="flex justify-between items-center px-6 py-4 bg-gray-800">
                <div className="flex gap-4">
                    <NavLink
                        to="/homepage"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg ${
                                isActive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/sessionhistory"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg ${
                                isActive ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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

            <div className="flex-1 flex p-4 gap-4 h-full">
                <div className="w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold mb-4">Hello {userName}, Start Learning Coding</h2>
                        <form>
                            {/* Input fields */}
                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Experience Level*</label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                                    required
                                    disabled={isLocked}
                                >
                                    <option value="">Choose</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Coding Language*</label>
                                <select
                                    name="preferredLang"
                                    value={formData.preferredLang}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                                    required
                                    disabled={isLocked}
                                >
                                    <option value="">Choose</option>
                                    <option value="python">Python</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="java">Java</option>
                                    <option value="c++">C++</option>
                                </select>
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
                                    disabled={isLocked}
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Anything else I should know?</label>
                                <textarea
                                    name="prompt"
                                    value={formData.prompt}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 rounded bg-gray-700 text-white focus:outline-none"
                                    placeholder="Add any additional information..."
                                ></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            className={`bg-purple-500 px-3 py-2 rounded-lg ${
                                isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                            }`}
                            onClick={handleGeneratePrompt}
                            disabled={isGenerating} // Disable only during generation
                        >
                            {isGenerating ? 'Generating...' : 'Generate Prompt'}
                        </button>
                        <button
                            className="bg-blue-500 px-3 py-2 rounded-lg hover:bg-blue-700"
                            onClick={handleMarkAsComplete}
                        >
                            Mark as Complete
                        </button>
                    </div>
                </div>

                <div
                    className="flex-1 bg-purple-300 p-4 rounded-lg shadow-lg"
                    style={{ height: 'calc(100vh)' }}
                >
                    <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">AI-Generated Response</h2>
                    <div
                        className="h-full overflow-y-auto p-4 bg-purple-200 rounded-lg"
                        style={{ maxHeight: 'calc(100vh - 100px)' }}
                    >
                        {generatedPrompt ? (
                            <ReactMarkdown className="prose prose-purple max-w-none">{generatedPrompt}</ReactMarkdown>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-600 text-center">Interactive coding activity area is here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
