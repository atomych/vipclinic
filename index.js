const express = require("express");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3000;

const services = [];

const servicesDesktopStruct = require("./database/services/servicesDesktopStruct.json");
const servicesMobileStruct = require("./database/services/servicesDesktopStruct.json");

const persons = require("./database/persons.json");
const beforeAfter = require("./database/beforeAfter.json");
const promotions = require("./database/promotions.json");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "pug");

// Инициализация services
const servicesInfo = require("./database/services/servicesInfo.json");
for (let id of servicesInfo.collectionID) {
  const service = require(`./database/services/collection/service${id.substring(
    1
  )}.json`);
  services.push(service);
}

app.get("/", (req, res) => {
  res.render("main", {
    beforeAfter: beforeAfter.filter((el) => el.persons.includes("main")),
    team: persons,
    promo: promotions,
    servicesInfo: servicesInfo,
    servicesDesktopStructFrom: servicesDesktopStruct,
    servicesMobileStructFrom: servicesMobileStruct,
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
