import "dotenv/config";
import http from "http";
import express, { type Request, type Response } from "express";
import cors from "cors";
import apiRoutes from "../src/routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "../src/middleware/errorHandler.js";
import { initSocket } from "./socket/index.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use("/api", apiRoutes);

app.use("/", (_req: Request, res: Response) => {
  res.json({ name: "Kanban Board API", status: "running" });
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`API + Socket.IO listening on port ${PORT}`);
});

export default app;
