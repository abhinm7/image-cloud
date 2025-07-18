const Folder = require('../models/Folder');
const Image = require('../models/Image');

exports.createFolder = async (req, res) => {
    const { name, parentId } = req.body;
    const owner = req.user.id;

    if (!name) {
        return res.status(400).json({ message: 'Folder name is required' });
    }

    try {
        const newFolder = new Folder({
            name,
            owner,
            parent: parentId || null,
        });

        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getFolders = async (req, res) => {
    const owner = req.user.id;
    const parentId = req.query.parentId || null;

    try {
        const folders = await Folder.find({ owner, parent: parentId });
        res.json(folders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getFolderContents = async (req, res) => {
    const owner = req.user.id;
    const { folderId } = req.params;

    try {
        const folders = await Folder.find({ owner, parent: folderId });
        const images = await Image.find({ owner, folder: folderId });

        res.json({ folders, images });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};