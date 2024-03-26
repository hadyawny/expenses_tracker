import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { bootstrap } from "./src/modules/index.routes.js";
import dotenv from "dotenv";
import cors from "cors"


const app = express();
const port = 3000;

app.use(cors())

dotenv.config();
app.use(express.json());

dbConnection();
bootstrap(app);

app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${process.env.PORT || port}!`));