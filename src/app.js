import dotenv from 'dotenv'
import express from 'express';
import morgan from 'morgan';
import asyncError from 'express-async-errors';

dotenv.config()
const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(function (req, res, next) {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500).json({
        error: 'Something broke!'
    })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log(`Ouchtion API is listening at http://localhost:${PORT}`);
});