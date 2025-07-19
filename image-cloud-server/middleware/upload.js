const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        if (!req.user || !req.user.id) {
            throw new Error("AUTHENTICATION_ERROR: User could not be verified for upload.");
        }
        const userId = req.user.id;
        const folderPath = `image-cloud/${userId}`;
        return {
            folder: folderPath,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ width: 1024, height: 1024, crop: 'limit' }]
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});

const handleUploadMiddleware = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error("--- ERROR CAUGHT FROM UPLOAD MIDDLEWARE ---");
            console.error(err);

            if (err.message.includes('AUTHENTICATION_ERROR')) {
                return res.status(401).json({ message: err.message });
            }
            if (err.message && err.message.includes('rate_limit')) {
                 return res.status(429).json({ message: "Too many uploads! You've hit Cloudinary's rate limit. Please wait a bit." });
            }
            if (err.message && err.message.includes('format')) {
                 return res.status(415).json({ message: `Unsupported file format. ${err.message}` });
            }
            return res.status(500).json({ message: "An error occurred during file upload.", error: err.message });
        }
        next();
    });
};

module.exports = handleUploadMiddleware;
