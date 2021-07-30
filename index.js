const express = require("express");
const app = express();
const data = require("./data.json");
const port = process.env.PORT || 5000;
// mongoose db connection
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// middleware custom auth
const auth = require("./middleware/auth");
mongoose
    .connect("mongodb+srv://nambi:nambi123@cluster0.ct1ru.mongodb.net/nambi?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.error(err);
    });
// routes
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const imageRoutes = require("./routes/image");
// middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/data", auth, (req, res) => {
    res.send(data);
});

app.get("/", (req, res) => {
    res.send("Heroku Check Build 123 !!");
});
// user routes
app.use("/api", userRoutes);
// auth routes
app.use("/api", authRoutes);
// post routes
app.use("/api", postRoutes);
// image routes
app.use("/api", imageRoutes);

app.listen(port, () => {
    console.log(`Server is Running on PORT=${port}`);
});
