import dotenv from 'dotenv';
import express from 'express';
import router from './api/routes';
import morgan from 'morgan';
import cors from 'cors';
import checkWon from './api/services/checkWon';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// public folder
app.use(express.static('localdata'));

// Cors
app.use(cors({
    methods: 'GET,PATCH,POST,DELETE'
}));

// Request log
app.use(morgan('dev'));

// Routes
router(app);

// Service
checkWon()

// Make app listen at port
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});