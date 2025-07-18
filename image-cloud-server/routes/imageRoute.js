const express = require('express');
const router = express.Router();
const { uploadImage, searchImages } = require('../controllers/imageController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('image'), uploadImage);
router.get('/search', auth, searchImages);

module.exports = router;
