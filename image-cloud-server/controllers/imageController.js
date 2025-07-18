const Image = require('../models/Image');
const Folder = require('../models/Folder');

exports.uploadImage = async (req, res) => {
    const { name, folderId } = req.body;
    const owner = req.user.id;

    if (!name || !folderId || !req.file) {
        return res.status(400).json({ message: 'Name, folderId, and image file are required' });
    }

    try {
        const folder = await Folder.findById(folderId);
        if (!folder || folder.owner.toString() !== owner) {
            return res.status(404).json({ message: 'Folder not found or access denied' });
        }

        const newImage = new Image({
            name,
            imageUrl: req.file.path, // The URL from Cloudinary is now in req.file.path
            cloudinaryId: req.file.filename, // The public_id from Cloudinary
            owner,
            folder: folderId,
        });

        const savedImage = await newImage.save();
        res.status(201).json(savedImage);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

exports.searchImages = async (req, res) => {
    const { q } = req.query;
    const owner = req.user.id;

    if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
    }

    try {
        const images = await Image.find({
            owner,
            name: { $regex: q, $options: 'i' },
        });

        res.json(images);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};
