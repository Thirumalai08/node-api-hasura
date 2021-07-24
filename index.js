const express = require("express");
const app = express();
const data = require("./data.json");
const port = process.env.PORT || 5000;

// app.use(express.json());

app.get("/data", (req, res) => {
    res.send(data);
});

app.get("/", (req, res) => {
    res.send("Heroku Check Build 123 !!");
});

app.listen(port, () => {
    console.log(`Server is Running on PORT=${port}`);
});

// module.exports = app;
