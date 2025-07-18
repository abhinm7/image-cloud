const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
// const configureCloudinary = require('./config/cloudinary');

const authRoutes = require('./routes/authRoutes');
// const folderRoutes = require('./routes/folders');
// const imageRoutes = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();
// configureCloudinary();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/folders', folderRoutes);
// app.use('/api/images', imageRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Image Cloud Server is running!' });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
