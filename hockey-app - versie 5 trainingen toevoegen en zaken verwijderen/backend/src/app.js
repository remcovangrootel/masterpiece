import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import playersRouter from './routes/players.js';
import trainingsRouter from './routes/trainings.js';
import scoresRouter from './routes/scores.js';

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/players', playersRouter);
app.use('/trainings', trainingsRouter);
app.use('/scores', scoresRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
