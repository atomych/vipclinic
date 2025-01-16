const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;

const services = [];

const servicesDesktopStruct = require("./database/services/servicesDesktopStruct.json");
const servicesMobileStruct = require("./database/services/servicesMobileStruct.json");

const persons = require("./database/persons.json");
const beforeAfter = require("./database/beforeAfter.json");
let promotions = require("./database/promotions.json");

function getRandomCode(length) {
  function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  let result = "";
  const symbols = ["ABCDEFGHIJKabcdefghijklmnoLMNOPQRSTUVWXYZpqrstuvwxyz", "0123456789"];

  for (let i = 0; i < length; i++) {
    if (i == 0) {
      result += symbols[0][getRandomNum(0, symbols[0].length - 1)];
    } else {
      const system = getRandomNum(0, 2);
      result += symbols[system][getRandomNum(0, symbols[system].length - 1)];
    }
  }

  return result;
}

function writeImageFile(dataUrl, path) {
  const base64Image = dataUrl.split(';base64,').pop();
  fs.writeFileSync(path, base64Image, {encoding: 'base64'});
}

const app = express();
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "pug");
app.use(express.json({ limit: "1mb" }));
app.set("views", [
  __dirname + "/views",
  __dirname + "/views/adminvip",
  __dirname + "/views/adminvip/tabs",
]);

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
    promo: promotions.sort((a, b) => a.order - b.order),
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

app.get("/adminvip/login", (req, res) => {
  res.render("login");
});

app.get("/adminvip/panel", (req, res) => {
  res.render("panel");
});

app.get("/adminvip/tabs/services", (req, res) => {
  res.render("servicesTab", {
    services: servicesInfo,
  });
});

app.get("/adminvip/tabs/persons", (req, res) => {
  res.render("personsTab", {
    persons: persons,
  });
});

app.get("/adminvip/tabs/beforeAfter", (req, res) => {
  res.render("beforeAfterTab", {
    beforeAfter: beforeAfter,
    persons: persons,
  });
});

app.get("/adminvip/tabs/promo", (req, res) => {
  res.render("promoTab", {
    promo: promotions,
  });
});

app.get("/adminvip/tabs/price", (req, res) => {
  res.render("priceTab");
});

app.get("/adminvip/tabs/links", (req, res) => {
  res.render("linksTab");
});

app.get("/adminvip/tabs/stats", (req, res) => {
  res.render("statsTab");
});

//! Pubilc API
app.get("/api/adminvip/person", (req, res) => {
  res.send(
    JSON.stringify(persons.filter((person) => person.id == req.query.id)[0])
  );
});

app.get("/api/adminvip/service", (req, res) => {
  res.send(
    JSON.stringify(services.filter((service) => service.id == req.query.id)[0])
  );
});

app.get("/api/adminvip/services-desktop-struct", (req, res) => {
  res.send(JSON.stringify(servicesDesktopStruct));
});

app.get("/api/adminvip/services-mobile-struct", (req, res) => {
  res.send(JSON.stringify(servicesMobileStruct));
});

app.get("/api/adminvip/services-short-info", (req, res) => {
  res.send(JSON.stringify(servicesInfo.shortInfo));
});

//! Private API
app.put("/private-api/adminvip/promo", (req, res) => {
  //! Проверка токена
  //
  //

  //! Обработка запроса
  
  if (req.body.delete) {
    //? Удаление акции
    const deleteItem = promotions.filter((promo) => promo.id == req.body.id)[0];
    fs.unlinkSync(`./public${deleteItem.url}`);
    promotions = promotions.filter((promo) => promo.id != req.body.id);
    //?..................
  } else if (req.body.id == "new") {
    //? Создание новой акции
    const newID = getRandomCode(6);
    const newImgName = getRandomCode(6);
    const path = `/images/main/promo/${newImgName}.${req.body.imageData.extension}`;
    writeImageFile(req.body.imageData.dataUrl, `./public${path}`);
    promotions.push({
      id: newID,
      url: path,
      order: req.body.order
    });
    //?..................
  } else {
    //? Остальные случаи
    const currentPromo = promotions.filter((promo) => promo.id == req.body.id)[0];

    if (req.body.imageData) {
      const newImgName = getRandomCode(6);
      const path = `/images/main/promo/${newImgName}.${req.body.imageData.extension}`;
      writeImageFile(req.body.imageData.dataUrl, `./public${path}`);
      fs.unlinkSync(`./public${currentPromo.url}`);
      currentPromo.url = path;
    }

    if (req.body.order) {
      currentPromo.order = req.body.order;
    }
    //?..................
  }

  //! Обновление файла
  fs.writeFileSync("./database/promotions.json", JSON.stringify(promotions));
  delete require.cache[require.resolve("./database/promotions.json")];
  promotions = require("./database/promotions.json");

  //! Отправка ответа на клиент
  res.sendStatus(201);
})

app.listen(port);
