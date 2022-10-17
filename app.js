const express = require("express");
const userRouts = require("./routes/users");
const app = express();
const { appLogger, onlineLogger } = require("./utils/logger");
const port = 3000;
var fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root path
app.get("/", (req, res, next) => {
  res.json({ message: "Okese" });
  appLogger.info(`Server got : ${req.url}!`);
});

// API path to get current log
app.get("/a", (req, res, next) => {
  let rawdata = fs.readFileSync("./logs/onlineLog.log");
  let student = JSON.parse(rawdata);
  // student.data.push("www", "sdf");
  let data = JSON.stringify(student);
  //fs.writeFileSync("./logs/onlineLog.log", data);

  var datas = JSON.stringify(student);
  appLogger.info(rawdata);
  let obj = {
    data: [],
  };
  obj.data.push(student);
  data = JSON.stringify(obj);
  // res.json(student);
  res.writeHead(200, { "Content-Type": "text/json" });
  res.write(data);
  res.end();
  return;
});

// API path to get current log
app.get("/api/getlogs", (req, res, next) => {
  var readable = fs.createReadStream("./logs/onlineLog.log");
  readable.pipe(res);
  return;
});

// API path to save to current log
app.get("/api/savelog", (req, res, next) => {
  onlineLogger.info(req.query.message);
  res.json({ message: "200" });
  return;
});

// Root path
app.get("/logviewer", (req, res, next) => {
  fs.readFile("./utils/logs.html", function (err, data) {
    if (err) {
      appLogger.info(`Server gotss : ${err}!` + err);
      throw err;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
    return;
  });
});

app.listen(port, () => {
  appLogger.info(`Server Started in port : ${port}!`);
});
