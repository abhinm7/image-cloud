import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFolderContents, createFolder, uploadImage } from '../services/api';
import { removeToken } from '../utils/auth';
import FolderCard from '../components/FolderCard';
import ImageCard from '../components/ImageCard';

const FolderViewPage = () => {
    const { folderId } = useParams();
    const navigate = useNavigate();

    const [contents, setContents] = useState({ folders: [], images: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [newFolderName, setNewFolderName] = useState('');
    
    const [newImageName, setNewImageName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


    const fetchContents = async () => {
        setLoading(true);
        try {
            const { data } = await getFolderContents(folderId);
            setContents(data);
        } catch (err) {
            setError('Failed to fetch folder contents.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContents();
    }, [folderId]);

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        try {
            await createFolder({ name: newFolderName, parentId: folderId });
            setNewFolderName('');
            fetchContents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create folder.');
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        setError('');
        if (!newImageName.trim() || !imageFile) {
            setError('Image name and file are required.');
            return;
        }
        setIsUploading(true);
        const formData = new FormData();
        formData.append('name', newImageName);
        formData.append('folderId', folderId);
        formData.append('image', imageFile);

        try {
            await uploadImage(formData);
            setNewImageName('');
            setImageFile(null);
            e.target.reset();
            fetchContents();
        } catch (err) {
            let errorMessage = 'An unknown error occurred during upload.';
            if (err.response) {
                errorMessage = err.response.data?.message || JSON.stringify(err.response.data) || 'Server returned an error.';
            } else if (err.request) {
                errorMessage = 'Could not connect to the server. Is the backend running? Please check the backend console for crash logs.';
            } else {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                           <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                                ← Back to Dashboard
                           </Link>
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
                    <h1 className="text-2xl font-semibold text-gray-900">Folder Contents</h1>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 p-4 border rounded-lg bg-white">
                        <form onSubmit={handleCreateFolder} className="space-y-2">
                            <h3 className="font-semibold">Create New Folder</h3>
                            <div className="flex items-center space-x-2">
                                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Sub-folder name" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                                <button type="submit" className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">Create</button>
                            </div>
                        </form>
                         <form onSubmit={handleImageUpload} className="space-y-2">
                            <h3 className="font-semibold">Upload New Image</h3>
                            <div className="flex items-center space-x-2">
                                <input type="text" value={newImageName} onChange={(e) => setNewImageName(e.target.value)} placeholder="Image name" className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                                <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full"/>
                                <button type="submit" disabled={isUploading} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {error && <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">{error}</div>}

                    {loading ? (
                        <p className="mt-8 text-center">Loading...</p>
                    ) : (
                        <>
                            <h2 className="mt-8 text-xl font-semibold text-gray-800">Folders</h2>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {contents.folders.map(folder => <FolderCard key={folder._id} folder={folder} />)}
                            </div>
                            
                            <h2 className="mt-8 text-xl font-semibold text-gray-800">Images</h2>
                             <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {contents.images.map(image => <ImageCard key={image._id} image={image} />)}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FolderViewPage;
