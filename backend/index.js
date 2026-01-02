require("dotenv").config();

const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

require("./config/redis");

const attachUserIfLoggedIn = require("./middleware/attachUserIfLoggedIn");
const roleAndAuthCheck = require("./middleware/roleAndAuthCheck");
const errorHandler = require("./middleware/errorHandler");
const verifyTripToken = require("./middleware/verifyTripToken");

const clientAuthRouter = require("./router/loginAndSignUp/client");
const transporterAuthRouter = require("./router/loginAndSignUp/transporter");
const userRouter = require("./router/user");
const clientRouter = require("./router/client");
const transporterRouter = require("./router/transporter");
const tripRouter = require("./router/trip");

const PORT = process.env.PORT;

async function startServer() {
  console.log("[BOOT] starting server");

  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.json());
  app.use(cookieParser());
  app.use(attachUserIfLoggedIn);

  app.use("/api/loginAndSignUp/client", clientAuthRouter);
  app.use("/api/loginAndSignUp/transporter", transporterAuthRouter);

  app.use("/api/client", roleAndAuthCheck("client"), clientRouter);
  app.use(
    "/api/transporter",
    roleAndAuthCheck("transporter"),
    transporterRouter
  );
  app.use("/api/me", userRouter);
  app.use("/api/trip", verifyTripToken, tripRouter);

  app.use(express.static("public"));
  app.use(errorHandler);

  await mongoose.connect(process.env.MONGO_URI);
  console.log("[DB] MongoDB connected");

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log("[SERVER] listening on port", PORT);
  });
}

startServer().catch((err) => {
  console.error("server failed to start", err);
  process.exit(1);
});
