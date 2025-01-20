const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;

let services = [];

let servicesDesktopStruct = require("./database/services/servicesDesktopStruct.json");
let servicesMobileStruct = require("./database/services/servicesMobileStruct.json");

let persons = require("./database/persons.json");
let beforeAfter = require("./database/beforeAfter.json");
let promotions = require("./database/promotions.json");
let links = require("./database/links.json");
let price = require("./database/price.json");

function getRandomCode(length) {
  function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  let result = "";
  const symbols = [
    "ABCDEFGHIJKabcdefghijklmnoLMNOPQRSTUVWXYZpqrstuvwxyz",
    "0123456789",
  ];

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
  const base64Image = dataUrl.split(";base64,").pop();
  fs.writeFileSync(path, base64Image, { encoding: "base64" });
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
let servicesInfo = require("./database/services/servicesInfo.json");
for (let id of servicesInfo.collectionID) {
  const service = require(`./database/services/collection/${id}.json`);
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
    links: links,
  });
});

app.get("/price", (req, res) => {
  res.render("price", {
    links: links,
    priceData: price,
  });
});

app.get("/service", (req, res) => {
  res.render("service", {
    service: services.filter((el) => el.id == req.query.id)[0],
    links: links,
  });
});

app.get("/person", (req, res) => {
  res.render("person", {
    person: persons.filter((el) => el.id == req.query.id)[0],
    beforeAfter: beforeAfter.filter((el) => el.persons.includes(req.query.id)),
    links: links,
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
  res.render("priceTab", { price: price });
});

app.get("/adminvip/tabs/links", (req, res) => {
  res.render("linksTab", links);
});

app.get("/adminvip/tabs/settings", (req, res) => {
  res.render("settingsTab");
});

//! Авторизация в админке
function verifyTokenSync(token) {
  const adminDATA = JSON.parse(
    fs.readFileSync("./database/admin.json", "utf-8")
  );

  try {
    const decoded = jwt.verify(token, adminDATA.adminvip.secretKey);
    if (decoded.login == adminDATA.adminvip.login) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

app.post("/adminvip/auth", (req, res) => {
  const adminDATA = JSON.parse(
    fs.readFileSync("./database/admin.json", "utf-8")
  );
  const passMatch = bcrypt.compareSync(
    req.body.password,
    adminDATA.adminvip.passwordHash
  );

  if (passMatch && adminDATA.adminvip.login) {
    const token = jwt.sign(
      { login: adminDATA.adminvip.login },
      adminDATA.adminvip.secretKey,
      { expiresIn: "1h" }
    );
    res.send(JSON.stringify({ login: true, token: token }));
  } else {
    res.send(JSON.stringify({ login: false }));
  }
});

app.post("/adminvip/is-auth", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];
    const adminDATA = JSON.parse(
      fs.readFileSync("./database/admin.json", "utf-8")
    );

    jwt.verify(token, adminDATA.adminvip.secretKey, function (err, decoded) {
      if (err) return res.send(JSON.stringify({ isAuth: false }));
      if (decoded.login == adminDATA.adminvip.login)
        res.send(JSON.stringify({ isAuth: true }));
      else res.send(JSON.stringify({ isAuth: false }));
    });
  } else {
    res.send(JSON.stringify({ isAuth: false }));
  }
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
app.post("/private-api/adminvip/change-password", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      const adminDATA = JSON.parse(
        fs.readFileSync("./database/admin.json", "utf-8")
      );
      const oldPassMatch = bcrypt.compareSync(
        req.body.old,
        adminDATA.adminvip.passwordHash
      );

      if (oldPassMatch) {
        const salt = bcrypt.genSaltSync(10);
        const newPassHash = bcrypt.hashSync(req.body.new, salt);
        adminDATA.adminvip.passwordHash = newPassHash;

        fs.writeFileSync("./database/admin.json", JSON.stringify(adminDATA));
        console.log("password changed!!!");
      } else {
        res.sendStatus(403);
      }

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/price", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      if (req.body.delete) {
        //? Удаление акции
        const deleteItem = price.filter((page) => page.id == req.body.id)[0];
        fs.unlinkSync(`./public${deleteItem.url}`);
        price = price.filter((page) => page.id != req.body.id);
        //?..................
      } else if (req.body.id == "new") {
        //? Создание новой акции
        const newID = getRandomCode(6);
        const newImgName = getRandomCode(6);
        const path = `/docs/prices/${newImgName}.${req.body.imageData.extension}`;
        writeImageFile(req.body.imageData.dataUrl, `./public${path}`);
        price.push({
          id: newID,
          url: path,
          order: req.body.order,
        });
        //?..................
      } else {
        //? Остальные случаи
        const currentPrice = price.filter((page) => page.id == req.body.id)[0];

        if (req.body.imageData) {
          const newImgName = getRandomCode(6);
          const path = `/docs/prices/${newImgName}.${req.body.imageData.extension}`;
          writeImageFile(req.body.imageData.dataUrl, `./public${path}`);
          fs.unlinkSync(`./public${currentPrice.url}`);
          currentPrice.url = path;
        }

        if (req.body.order) {
          currentPrice.order = req.body.order;
        }
        //?..................
      }

      //! Обновление файла
      fs.writeFileSync("./database/price.json", JSON.stringify(price));
      delete require.cache[require.resolve("./database/price.json")];
      price = require("./database/price.json");

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/links", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      links.yclients = req.body.yclients;
      links.social.phone = req.body.social.phone;
      links.social.wa = req.body.social.wa;
      links.social.tg = req.body.social.tg;

      fs.writeFileSync("./database/links.json", JSON.stringify(links));
      delete require.cache[require.resolve("./database/links.json")];
      links = require("./database/links.json");

      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/services-dekstop-struct", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      //! Обработка запроса
      const newDesktopStruct = req.body.struct;

      for (let image of req.body.images) {
        const newImageName = getRandomCode(6);
        const newImagePath = `/images/main/services/${newImageName}.${image.imageData.extension}`;
        writeImageFile(image.imageData.dataUrl, `./public${newImagePath}`);
        newDesktopStruct.filter(
          (coll) => coll.collection == image.collection
        )[0].lines[image.index].bigBgUrl = newImagePath;
      }

      for (let collection of newDesktopStruct) {
        collection.lines = collection.lines.filter((line) => line != null);
      }

      // fs.readdir('./public/images/main/services/', (err, files) => {
      //   if (err)
      //     console.log(err);
      //   else {
      //     files.forEach(file => {
      //       console.log(file);
      //     })
      //   }
      // })

      //! Обновление файла
      fs.writeFileSync(
        "./database/services/servicesDesktopStruct.json",
        JSON.stringify(newDesktopStruct)
      );
      delete require.cache[
        require.resolve("./database/services/servicesDesktopStruct.json")
      ];
      servicesDesktopStruct = require("./database/services/servicesDesktopStruct.json");

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/services-mobile-struct", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      //! Обработка запроса
      const newMobileStruct = req.body.struct;

      for (let image of req.body.images) {
        const newImageName = getRandomCode(6);
        const newImagePath = `/images/main/services/${newImageName}.${image.imageData.extension}`;
        writeImageFile(image.imageData.dataUrl, `./public${newImagePath}`);
        newMobileStruct.filter(
          (coll) => coll.collection == image.collection
        )[0].items[image.cell].url = newImagePath;
      }

      for (let collection of newMobileStruct) {
        collection.items = collection.items.filter((cell) => cell != null);
      }

      //! Обновление файла
      fs.writeFileSync(
        "./database/services/servicesMobileStruct.json",
        JSON.stringify(newMobileStruct)
      );
      delete require.cache[
        require.resolve("./database/services/servicesMobileStruct.json")
      ];
      servicesMobileStruct = require("./database/services/servicesMobileStruct.json");

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/services-list", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      //! Обработка запроса
      if (req.body.delete) {
        //? Удаление услуги
        services = services.filter((service) => service.id != req.body.id);
        servicesInfo.collectionID = servicesInfo.collectionID.filter(
          (el) => el != req.body.id
        );
        servicesInfo.shortInfo = servicesInfo.shortInfo.filter(
          (el) => el.id != req.body.id
        );

        fs.rmSync(`./public/images/services/${req.body.id}`, {
          recursive: true,
          force: true,
        });
        fs.unlinkSync(`./database/services/collection/${req.body.id}.json`);

        fs.writeFileSync(
          "./database/services/servicesInfo.json",
          JSON.stringify(servicesInfo)
        );
        delete require.cache[
          require.resolve("./database/services/servicesInfo.json")
        ];
        servicesInfo = require("./database/services/servicesInfo.json");
        //?..................
      } else if (req.body.id == "new") {
        //? Добавление новой услуги
        let newService = {};
        const newID = getRandomCode(6);

        newService.id = newID;
        newService.title = req.body.content.name;
        newService.description = `${req.body.content.name} - ${req.body.shortInfoValue}`;
        newService.keywords = req.body.shortInfoValue;
        newService.url = `https://vipclinicspb.ru/service?id=${newID}`;

        newService.content = {};
        newService.content.name = req.body.content.name;
        newService.content.preName = req.body.content.name;
        newService.content.noneLast = req.body.content.noneLast;
        newService.content.stats = req.body.content.stats;
        newService.content.textPlace = req.body.content.textPlace;
        newService.content.pricePlace = req.body.content.pricePlace;

        newService.images = {
          desktop: {},
          mobile: {},
        };
        fs.mkdirSync(`./public/images/services/${newID}`);

        const desktopFirstImageName = getRandomCode(6);
        const dekstopFirstImagePath = `/images/services/${newID}/${desktopFirstImageName}.${req.body.images.desktop.first.extension}`;
        writeImageFile(
          req.body.images.desktop.first.dataUrl,
          `./public${dekstopFirstImagePath}`
        );
        newService.images.desktop.first = dekstopFirstImagePath;

        const desktopSecondImageName = getRandomCode(6);
        const dekstopSecondImagePath = `/images/services/${newID}/${desktopSecondImageName}.${req.body.images.desktop.second.extension}`;
        writeImageFile(
          req.body.images.desktop.second.dataUrl,
          `./public${dekstopSecondImagePath}`
        );
        newService.images.desktop.second = dekstopSecondImagePath;

        const desktopThirdImageName = getRandomCode(6);
        const dekstopThirdImagePath = `/images/services/${newID}/${desktopThirdImageName}.${req.body.images.desktop.third.extension}`;
        writeImageFile(
          req.body.images.desktop.third.dataUrl,
          `./public${dekstopThirdImagePath}`
        );
        newService.images.desktop.third = dekstopThirdImagePath;

        const mobileFirstImageName = getRandomCode(6);
        const mobileFirstImagePath = `/images/services/${newID}/${mobileFirstImageName}.${req.body.images.mobile.first.extension}`;
        writeImageFile(
          req.body.images.mobile.first.dataUrl,
          `./public${mobileFirstImagePath}`
        );
        newService.images.mobile.first = mobileFirstImagePath;

        const mobileSecondImageName = getRandomCode(6);
        const mobileSecondImagePath = `/images/services/${newID}/${mobileSecondImageName}.${req.body.images.mobile.second.extension}`;
        writeImageFile(
          req.body.images.mobile.second.dataUrl,
          `./public${mobileSecondImagePath}`
        );
        newService.images.mobile.second = mobileSecondImagePath;

        servicesInfo.collectionID.push(newID);
        servicesInfo.shortInfo.push({
          id: newID,
          name: req.body.content.name,
          descryption: req.body.shortInfoValue,
          url: `/service?id=${newID}`,
        });

        fs.writeFileSync(
          "./database/services/servicesInfo.json",
          JSON.stringify(servicesInfo)
        );
        delete require.cache[
          require.resolve("./database/services/servicesInfo.json")
        ];
        servicesInfo = require("./database/services/servicesInfo.json");

        fs.writeFileSync(
          `./database/services/collection/${newID}.json`,
          JSON.stringify(newService)
        );
        newService = require(`./database/services/collection/${newID}.json`);
        services.push(newService);
        //?..................
      } else {
        //? Остальные случаи
        let currentService = services.filter(
          (service) => service.id == req.body.id
        )[0];

        currentService.title = req.body.content.name;
        currentService.description = `${req.body.content.name} - ${req.body.shortInfoValue}`;
        currentService.keywords = req.body.shortInfoValue;

        currentService.content.name = req.body.content.name;
        currentService.content.preName = req.body.content.name;
        currentService.content.noneLast = req.body.content.noneLast;
        currentService.content.stats = req.body.content.stats;
        currentService.content.textPlace = req.body.content.textPlace;
        currentService.content.pricePlace = req.body.content.pricePlace;

        if (req.body.images) {
          if (req.body.images.desktop.first) {
            fs.unlinkSync(`./public${currentService.images.desktop.first}`);
            const newPath =
              currentService.images.desktop.first.split(".")[0] +
              "." +
              req.body.images.desktop.first.extension;
            writeImageFile(
              req.body.images.desktop.first.dataUrl,
              `./public${newPath}`
            );
            currentService.images.desktop.first = newPath;
          }

          if (req.body.images.desktop.second) {
            fs.unlinkSync(`./public${currentService.images.desktop.second}`);
            const newPath =
              currentService.images.desktop.second.split(".")[0] +
              "." +
              req.body.images.desktop.second.extension;
            writeImageFile(
              req.body.images.desktop.second.dataUrl,
              `./public${newPath}`
            );
            currentService.images.desktop.second = newPath;
          }

          if (req.body.images.desktop.third) {
            fs.unlinkSync(`./public${currentService.images.desktop.third}`);
            const newPath =
              currentService.images.desktop.third.split(".")[0] +
              "." +
              req.body.images.desktop.third.extension;
            writeImageFile(
              req.body.images.desktop.third.dataUrl,
              `./public${newPath}`
            );
            currentService.images.desktop.third = newPath;
          }

          if (req.body.images.mobile.first) {
            fs.unlinkSync(`./public${currentService.images.mobile.first}`);
            const newPath =
              currentService.images.mobile.first.split(".")[0] +
              "." +
              req.body.images.mobile.first.extension;
            writeImageFile(
              req.body.images.mobile.first.dataUrl,
              `./public${newPath}`
            );
            currentService.images.mobile.first = newPath;
          }

          if (req.body.images.mobile.second) {
            fs.unlinkSync(`./public${currentService.images.mobile.second}`);
            const newPath =
              currentService.images.mobile.second.split(".")[0] +
              "." +
              req.body.images.mobile.second.extension;
            writeImageFile(
              req.body.images.mobile.second.dataUrl,
              `./public${newPath}`
            );
            currentService.images.mobile.second = newPath;
          }
        }

        services = services.filter((service) => service != currentService);
        fs.writeFileSync(
          `./database/services/collection/${currentService.id}.json`,
          JSON.stringify(currentService)
        );
        delete require.cache[
          require.resolve(
            `./database/services/collection/${currentService.id}.json`
          )
        ];
        currentService = require(`./database/services/collection/${currentService.id}.json`);
        services.push(currentService);
        services.sort((a, b) => {
          return (
            servicesInfo.collectionID.indexOf(a) -
            servicesInfo.collectionID.indexOf(b)
          );
        });

        const currentShort = servicesInfo.shortInfo.filter(
          (el) => el.id == req.body.id
        )[0];
        currentShort.name = req.body.content.name;
        currentShort.descryption = req.body.shortInfoValue;

        fs.writeFileSync(
          "./database/services/servicesInfo.json",
          JSON.stringify(servicesInfo)
        );
        delete require.cache[
          require.resolve("./database/services/servicesInfo.json")
        ];
        servicesInfo = require("./database/services/servicesInfo.json");

        //?..................
      }

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/persons", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      //! Обработка запроса
      if (req.body.delete) {
        //? Удаление специалиста
        const deleteItem = persons.filter((el) => el.id == req.body.id)[0];
        fs.unlinkSync(`./public${deleteItem.photo}`);
        persons = persons.filter((el) => el.id != req.body.id);

        for (let beforeAfterElement of beforeAfter) {
          beforeAfterElement.persons = beforeAfterElement.persons.filter(
            (el) => el != req.body.id
          );
        }

        fs.writeFileSync(
          "./database/beforeAfter.json",
          JSON.stringify(beforeAfter)
        );
        delete require.cache[require.resolve("./database/beforeAfter.json")];
        beforeAfter = require("./database/beforeAfter.json");
        //?..................
      } else if (req.body.id == "new") {
        //? Создание новой записи
        const newID = getRandomCode(6);
        const newImgName = getRandomCode(6);
        const path = `/images/persons/${newImgName}.${req.body.imageData.extension}`;
        writeImageFile(req.body.imageData.dataUrl, `./public${path}`);

        const fullName =
          req.body.content.secondname + " " + req.body.content.firstname;
        const newObj = {
          id: newID,
          title: fullName,
          description: `${req.body.content.profession} | ${fullName}`,
          keywords: req.body.content.profession,
          url: `https://vipclinicspb.ru/person?id=${newID}`,
          urlBtn: `/person?id=${newID}`,
          photo: path,
          content: req.body.content,
        };
        newObj.content.fullname = fullName;
        persons.push(newObj);
        //?..................
      } else {
        //? Остальные случаи
        const currentElement = persons.filter((el) => el.id == req.body.id)[0];

        if (req.body.imageData) {
          const newImgName = getRandomCode(6);
          const path = `/images/persons/${newImgName}.${req.body.imageData.extension}`;
          writeImageFile(req.body.imageData.dataUrl, `./public${path}`);
          fs.unlinkSync(`./public${currentElement.photo}`);
          currentElement.photo = path;
        }

        currentElement.content.education = req.body.content.education;
        currentElement.content.skills = req.body.content.skills;

        currentElement.content.firstname = req.body.content.firstname;
        currentElement.content.secondname = req.body.content.secondname;
        currentElement.content.profession = req.body.content.profession;
        currentElement.content.fullname =
          req.body.content.secondname + " " + req.body.content.firstname;

        currentElement.title = currentElement.content.fullname;
        currentElement.description = `${req.body.content.profession} | ${currentElement.content.fullname}`;
        currentElement.keywords = currentElement.content.profession;
        //?..................
      }

      //! Обновление файла
      fs.writeFileSync("./database/persons.json", JSON.stringify(persons));
      delete require.cache[require.resolve("./database/persons.json")];
      persons = require("./database/persons.json");

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/before-after", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      //! Обработка запроса
      if (req.body.delete) {
        //? Удаление фото
        const deleteItem = beforeAfter.filter((el) => el.id == req.body.id)[0];
        fs.unlinkSync(`./public${deleteItem.url}`);
        beforeAfter = beforeAfter.filter((el) => el.id != req.body.id);
        //?..................
      } else if (req.body.id == "new") {
        //? Создание новой записи
        const newID = getRandomCode(6);
        const newImgName = getRandomCode(6);
        const path = `/images/main/before-after/${newImgName}.${req.body.imageData.extension}`;
        writeImageFile(req.body.imageData.dataUrl, `./public${path}`);
        beforeAfter.push({
          id: newID,
          url: path,
          text: req.body.text,
          persons: req.body.persons,
        });
        //?..................
      } else {
        //? Остальные случаи
        const currentElement = beforeAfter.filter(
          (el) => el.id == req.body.id
        )[0];

        if (req.body.imageData) {
          const newImgName = getRandomCode(6);
          const path = `/images/main/before-after/${newImgName}.${req.body.imageData.extension}`;
          writeImageFile(req.body.imageData.dataUrl, `./public${path}`);
          fs.unlinkSync(`./public${currentElement.url}`);
          currentElement.url = path;
        }

        if (req.body.text) {
          currentElement.text = req.body.text;
        }

        if (req.body.persons) {
          currentElement.persons = req.body.persons;
        }
        //?..................
      }

      //! Обновление файла
      fs.writeFileSync(
        "./database/beforeAfter.json",
        JSON.stringify(beforeAfter)
      );
      delete require.cache[require.resolve("./database/beforeAfter.json")];
      beforeAfter = require("./database/beforeAfter.json");

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.put("/private-api/adminvip/promo", (req, res) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];

    if (verifyTokenSync(token)) {
      //! Обработка запроса
      if (req.body.delete) {
        //? Удаление акции
        const deleteItem = promotions.filter(
          (promo) => promo.id == req.body.id
        )[0];
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
          order: req.body.order,
        });
        //?..................
      } else {
        //? Остальные случаи
        const currentPromo = promotions.filter(
          (promo) => promo.id == req.body.id
        )[0];

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
      fs.writeFileSync(
        "./database/promotions.json",
        JSON.stringify(promotions)
      );
      delete require.cache[require.resolve("./database/promotions.json")];
      promotions = require("./database/promotions.json");

      //! Отправка ответа на клиент
      res.sendStatus(201);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.listen(port);
