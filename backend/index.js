const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
require("./config/redis");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const httpServer = createServer(app);
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const clientLoginAndSignUpRouter = require("./router/loginAndSignUp/client");
const transporterLoginAndSignUpRouter = require("./router/loginAndSignUp/transporter");
const { attachUserIfLoggedIn } = require("./middleware/attachUserIfLoggedIn");
const userRouter = require("./router/user");
const clientRouter = require("./router/client");
const transporterRouter = require("./router/transporter");
const { roleAndAuthCheck } = require("./middleware/roleAndAuthCheck");
const bidsRouter = require("./router/bid");
const errorHandler = require("./middleware/errorHandler");
const { initSocket } = require("./config/socket");
const io = initSocket(httpServer);

app.use(express.json());
app.use(cookieParser());
app.use(attachUserIfLoggedIn);

app.use("/api/loginAndSignUp/client", clientLoginAndSignUpRouter);
app.use("/api/loginAndSignUp/transporter", transporterLoginAndSignUpRouter);
app.use("/api/client", roleAndAuthCheck("client"), clientRouter);
app.use("/api/transporter", roleAndAuthCheck("transporter"), transporterRouter);
app.use("/api/me", userRouter);

app.use("/api/bids", bidsRouter);
app.use(express.static("public"));
app.use(errorHandler);
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("mongooose connected");
});

httpServer.listen(PORT, () => {
  console.log("server is running!");
});
