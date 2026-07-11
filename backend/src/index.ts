import "dotenv/config"
import express, { type Request, type Response } from "express"
import cors from "cors"
import apiRoutes from "../src/routes/index.js"
import {errorHandler,notFoundHandler} from "../src/middleware/errorHandler.js"


const app = express();
const PORT =  process.env.PORT || 5050

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json({limit: "1mb"}));

app.use("/api", apiRoutes);

app.use("/", (_req: Request, res:Response) => {
    res.json({name: "Kanban Board API", status: "running"})
});

app.use(notFoundHandler);
app.use(errorHandler)

app.listen(PORT, ()=> {
    console.log("Server Is Running")
})

export default app;