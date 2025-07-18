const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: (req, file) => {
            const { folderId } = req.body;
            const userId = req.user.id;
            return `image-cloud/${userId}/${folderId || 'root'}`;
        },
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 1024, height: 1024, crop: 'limit' }]
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 
    }
});

module.exports = upload;
