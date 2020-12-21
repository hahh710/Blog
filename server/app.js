import express from "express";
import mongoose from "mongoose";
import config from "./config";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

//Routes
import postRoutes from "./routes/api/post";
import userRoutes from "./routes/api/user";
import authRoutes from "./routes/api/auth";

const app = express();
const { MONGO_URI } = config;

//Route
app.use(hpp());
app.use(helmet()); //library For Server Security
// server
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("dev")); // this let us see the logs in dev environment

//Body Parser
app.use(express.json()); // telling that we are getting json format file

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connecting Success."))
  .catch((e) => console.log(e));

// Use Routes
app.get("/");
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
