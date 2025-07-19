import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRootFolders, createFolder, searchImages } from '../services/api';
import { removeToken } from '../utils/auth';
import FolderCard from '../components/FolderCard';
import ImageCard from '../components/ImageCard';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [newFolderName, setNewFolderName] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchFolders = async () => {
        try {
            const { data } = await getRootFolders();
            setFolders(data);
        } catch (err) {
            setError('Failed to fetch folders.');
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
            fetchFolders(); 
        } catch (err) {
            setError('Failed to create folder.');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const { data } = await searchImages(searchQuery);
            setSearchResults(data);
        } catch (err) {
            setError('Failed to perform search.');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center font-bold text-xl text-indigo-600">
                            My Cloud
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    <form onSubmit={handleSearch} className="mb-8 flex items-center w-full">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search all your images..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" className="px-5 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700">
                            Search
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {searchResults.map(image => <ImageCard key={image._id} image={image} />)}
                            </div>
                        </div>
                    )}

                    <div className="mb-8">
                        <form onSubmit={handleCreateFolder} className="flex items-center space-x-2">
                            <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New folder name" className="px-3 py-2 border border-gray-300 rounded-md"/>
                            <button type="submit" className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
                                Create Folder
                            </button>
                        </form>
                    </div>

                    {error && <p className="mt-4 text-red-500">{error}</p>}
                    
                    <h1 className="text-2xl font-semibold text-gray-900">My Folders</h1>
                    {loading ? (
                        <p className="mt-8 text-center">Loading folders...</p>
                    ) : (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {folders.map(folder => <FolderCard key={folder._id} folder={folder} />)}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
