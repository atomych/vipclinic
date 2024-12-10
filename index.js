const express = require("express");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3000;

const services = require("./database/services.json");
const persons = require("./database/persons.json");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/price", (req, res) => {
  res.render("price");
});

app.get("/service", (req, res) => {
  res.render("service", services.filter(el => el.id == req.query.id)[0]);
});

app.get("/person", (req, res) => {
  res.render("person", persons.filter(el => el.id == req.query.id)[0]);
});

app.listen(port);
