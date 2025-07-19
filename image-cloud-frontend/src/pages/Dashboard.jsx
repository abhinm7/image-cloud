import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRootFolders, createFolder } from '../services/api';
import { removeToken } from '../utils/auth';
import FolderCard from '../components/FolderCard'; // We'll create this next

const DashboardPage = () => {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newFolderName, setNewFolderName] = useState('');

    const fetchFolders = async () => {
        try {
            const { data } = await getRootFolders();
            setFolders(data);
        } catch (err) {
            setError('Failed to fetch folders.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await createFolder({ name: newFolderName, parentId: null });
            setNewFolderName('');
            fetchFolders(); // Refresh the folder list
        } catch (err) {
            setError('Failed to create folder.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center font-bold text-xl text-indigo-600">
                                My Cloud
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    
                    <form onSubmit={handleCreateFolder} className="mt-4 flex items-center space-x-2">
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="New folder name"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                            Create Folder
                        </button>
                    </form>

                    {error && <p className="mt-4 text-red-500">{error}</p>}

                    {loading ? (
                        <p className="mt-8 text-center">Loading folders...</p>
                    ) : (
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {folders.map(folder => (
                                <FolderCard key={folder._id} folder={folder} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
