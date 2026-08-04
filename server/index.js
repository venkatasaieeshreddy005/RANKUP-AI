if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const connectdb = require("./config/connectdb.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/authroute.js");
const userRoute = require("./routes/userroute.js");
const interviewRouter = require("./routes/interview.js");

connectdb();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Route Handlers
app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/interview", interviewRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});