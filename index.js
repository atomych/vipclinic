const express = require("express");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3000;

const services = require("./database/services.json");
const persons = require("./database/persons.json");
const beforeAfter = require("./database/beforeAfter.json");
const promotions = require("./database/promotions.json");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("main", {
    beforeAfter: beforeAfter.filter((el) => el.persons.includes("main")),
    team: persons,
    promo: promotions,
  });
});

app.get("/price", (req, res) => {
  res.render("price");
});

app.get("/service", (req, res) => {
  res.render("service", services.filter((el) => el.id == req.query.id)[0]);
});

app.get("/person", (req, res) => {
  res.render("person", {
    person: persons.filter((el) => el.id == req.query.id)[0],
    beforeAfter: beforeAfter.filter((el) => el.persons.includes(req.query.id)),
  });
});

app.listen(port);
