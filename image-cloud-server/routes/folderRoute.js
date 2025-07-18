const express = require('express');
const router = express.Router();
const { createFolder, getFolders, getFolderContents } = require('../controllers/folderController');
const auth = require('../middleware/auth');

router.post('/', auth, createFolder);
router.get('/', auth, getFolders);
router.get('/:folderId', auth, getFolderContents);

module.exports = router;
