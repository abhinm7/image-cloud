import React from 'react';

const ImageCard = ({ image }) => {
    return (
        <div className="group relative flex flex-col items-center justify-center p-2 text-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <img
                src={image.imageUrl}
                alt={image.name}
                className="w-full h-32 object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <p className="text-sm font-medium text-white truncate w-full">
                    {image.name}
                </p>
            </div>
        </div>
    );
};

export default ImageCard;
