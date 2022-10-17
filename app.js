const express = require("express");
const userRouts = require("./routes/users");
const authRouts = require("./routes/auth");
const app = express();
const { appLogger } = require("./utils/logger");
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
app.get("/api/getlog", (req, res, next) => {
  var readable = fs.createReadStream("./logs/onlineLog.log");
  readable.pipe(res);
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
