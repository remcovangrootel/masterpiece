import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRouter from "./routes/auth.js";
import playersRouter from "./routes/players.js";
import trainingsRouter from "./routes/trainings.js";
import scoresRouter from "./routes/scores.js";
import absencesRouter from "./routes/absences.js"; // 🔥 NIEUW

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// TEST ENDPOINT
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Hockey backend draait!" });
});

// ROUTES
app.use("/auth", authRouter);
app.use("/players", playersRouter);
app.use("/trainings", trainingsRouter);
app.use("/scores", scoresRouter);
app.use("/absences", absencesRouter); // 🔥 NIEUW

// SERVER START
const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Backend running on http://localhost:${port}`)
);


