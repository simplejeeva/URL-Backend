import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import cors from "cors";
import UserRouter from "./routes/user.route.js";
import UrlRouter from "./routes/url.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("mongodb is connected");

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", UserRouter);
app.use("/api/shortURL", UrlRouter);

//Home
app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩 <h1>Welcome to URL Shortner App<h1>");
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export { client };
