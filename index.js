import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import fs from "fs";
import cors from "cors";

const app = express();
dotenv.config();
connectDB();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/static", express.static("uploads"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

fs.readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

app.listen(process.env.PORT, () =>
  console.log(`Server Running on port ${process.env.PORT}`)
);
