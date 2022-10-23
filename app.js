const express = require("express");
const app = express();
const { appLogger, onlineLogger } = require("./utils/logger");
const port = 3000;
var fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Root path
app.get("/", (req, res, next) => {
  res.json({
    message: "See https://github.com/Ckal/logviewer for more detials ... ",
  });
});

// Root path
app.get("/l", (req, res, next) => {});

// get Raw current OnlineLog.log
app.get("/api/getRawLog", (req, res, next) => {
  let rawdata = fs.readFileSync("./logs/onlineLog.log", "utf8");

  data = JSON.stringify(rawdata)

    .replaceAll('\\"', '"')
    .replaceAll("\\t", "")
    .replaceAll("\\n", "")
    .replaceAll("}{", "},{")
    .replaceAll('["{', "[{")
    .replaceAll('}"]', "}]")
    .replaceAll('":["', '":[');
  //res.json(data);
  //res.writeHead(200, { "Content-Type": "text/json" });
  res.write(data.removeCharAt(0).removeCharAt(data.lenght));
  res.end();
  return;
});

String.prototype.removeCharAt = function (i) {
  var tmp = this.split(""); // convert to an array
  tmp.splice(i - 1, 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
  return tmp.join(""); // reconstruct the string
};
// API path to get current datatanle log
app.get("/api/getDataTableLog", (req, res, next) => {
  let rawdata = fs.readFileSync("./logs/onlineLog.log", "utf8");

  let data = JSON.stringify(rawdata);

  let obj = {
    data: [],
  };
  obj.data.push(rawdata);
  data = JSON.stringify(obj)
    .replaceAll('\\"', '"')
    .replaceAll("\\t", "")
    .replaceAll("\\n", "")
    .replaceAll('\\r', '')
    .replaceAll("}{", "},{")
    .replaceAll('["{', "[{")
    .replaceAll('}"]', "}]")
    .replaceAll('":["', '":[')
    . replaceAll('}"]}', '}]}')     ;
  //res.json(data);
  //res.writeHead(200, { "Content-Type": "text/json" });
  res.write(data);
  res.end();
  return;
});

// API path to get current log
app.get("/api/getRawLogs", (req, res, next) => {
  var readable = fs.createReadStream("./logs/onlineLog.log");
  readable.pipe(res);
  return;
});

// API to delte the current log
app.get("/api/deleteLog", (req, res, next) => {
  fs.writeFile("./logs/onlineLog.log", "", function () {
    console.log("done");
  });
  return;
});

// API path to save to current log
app.get("/api/saveLog", (req, res, next) => {
  onlineLogger.info(req.query.message);
  res.json({ message: "200" });
  return;
});

// Root path
app.get("/dashboard.js", (req, res, next) => {
  fs.readFile("./public/dashboard.js", function (err, data) {
    if (err) {
      appLogger.info(`Server gotss : ${err}!` + err);
      throw err;
    }
    res.writeHead(200, { "Content-Type": "text/javascript" });

    res.end(data);
    return;
  });
});
// Root path
app.get("/logViewer", (req, res, next) => {
  fs.readFile("./public/logViewer.html", function (err, data) {
    if (err) {
      appLogger.info(`Server gotss : ${err}!` + err);
      throw err;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
    return;
  });
});
// Root path
app.get("/logViewerFrame", (req, res, next) => {
  fs.readFile("./public/logs.html", function (err, data) {
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
