import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket/index.js";
import { sweepStaleRooms } from "./services/roomManager.js";
import adminRouter from "./routes/admin.js";
import healthRouter from "./routes/health.js";

const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

const app = express();
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/health", healthRouter);
app.use("/admin", adminRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN, credentials: true },
});

registerSocketHandlers(io);

// Clear out abandoned rooms every 30 minutes so memory doesn't grow forever.
setInterval(sweepStaleRooms, 30 * 60 * 1000);

httpServer.listen(PORT, () => {
  console.log(`AFTERHOURS server listening on :${PORT}`);
});
