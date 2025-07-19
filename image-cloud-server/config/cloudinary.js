const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const configureCloudinary = () => {
    const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    if (Object.values(config).some(value => !value)) {
        console.error("api key error");
        process.exit(1);
    }

    cloudinary.config(config);
    console.log('Cloudinary configured successfully.');
};

module.exports = configureCloudinary;
