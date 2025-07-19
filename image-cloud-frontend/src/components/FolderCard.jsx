import React from 'react';
import { Link } from 'react-router-dom';

const FolderCard = ({ folder }) => {
    return (
        <Link
            to={`/folder/${folder._id}`}
            className="flex flex-col items-center justify-center p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-500 transition-all duration-200"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-800 truncate w-full">
                {folder.name}
            </p>
        </Link>
    );
};

export default FolderCard;
