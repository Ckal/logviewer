const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(express.static("logs"));

const port = 3000;



// TODO: make this part more dynamic 
const { appLogger, onlineLogger } = require("./utils/logger");

var fs = require("fs");

// Monitoring the node.js creates a page /status which is included as iframe
app.use(require('express-status-monitor')());

// Compress when filter false https://medium.com/@victor.valencia.rico/gzip-compression-with-node-js-cc3ed74196f9
// for node server side gzip compression of html, can be turned off by filter see const shouldCompress
const compression = require('compression');

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};
// Compress all HTTP responses
app.use(compression({
  // filter: Decide if the answer should be compressed or not,
  // depending on the 'shouldCompress' function above
  filter: shouldCompress,
  // threshold: It is the byte threshold for the response 
  // body size before considering compression, the default is 1 kB
  threshold: 0
}));

// /////////////////////////////
//        Root path          //
// ////////////////////////////
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
// API path to get current datatable log
app.get("/api/getDataTableLog", (req, res, next) => {
  let rawdata = fs.readFileSync("./logs/onlineLog.log", "utf8");

  let data = JSON.stringify(rawdata);

  let obj = {
    data: [],
  };
  obj.data.push(rawdata);
  res.json(data);
});

// API path to get current log
app.get("/api/getRawLogs", (req, res, next) => {
  var readable = fs.createReadStream("./logs/onlineLog.log");
  readable.pipe(res);
  return;
});

// API to delete the current log
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
      appLogger.severe(`Server severer error in get dashboard.js  : ${err}!` + err);
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
      appLogger.severe(`Server severer error in logViewer : ${err}!` + err);
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
      appLogger.severe(`Server severer error in logViewerFrame : ${err}!` + err);
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
