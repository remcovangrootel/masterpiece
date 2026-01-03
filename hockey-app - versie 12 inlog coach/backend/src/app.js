import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// BESTAANDE ROUTES
import playersRouter from './routes/players.js';
import trainingsRouter from './routes/trainings.js';
import scoresRouter from './routes/scores.js';

// NIEUWE AUTH ROUTE
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();

// CORS + JSON
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// TEST ENDPOINT
app.get('/', (req, res) => res.json({ status: 'ok' }));

// AUTH ROUTE TOEVOEGEN
app.use('/auth', authRouter);

// BESTAANDE ROUTES
app.use('/players', playersRouter);
app.use('/trainings', trainingsRouter);
app.use('/scores', scoresRouter);

// SERVER START
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));

