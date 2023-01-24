const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { createLogger, format, transports } = require("winston");
const customFormat = format.combine(
  format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
  format.align(),
  format.printf(
    (i) =>
      `{"timestamp" : "${[i.timestamp]}", "level" : "${i.level}", "message": "${
        i.message
      }"}`
  )
);

const onlineFormat = format.combine(format.printf((i) => `${i.message}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(express.static("logs"));

const port = 3000;

// TODO: make this part more dynamic
const { appLogger, onlineLogger } = require("./utils/logger");

var fs = require("fs");

// Monitoring the node.js creates a page /status which is included as iframe
app.use(require("express-status-monitor")());

// Compress when filter false https://medium.com/@victor.valencia.rico/gzip-compression-with-node-js-cc3ed74196f9
// for node server side gzip compression of html, can be turned off by filter see const shouldCompress
const compression = require("compression");

const shouldCompress = (req, res) => {
  if (req.headers["x-no-compression"]) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};
// Compress all HTTP responses
app.use(
  compression({
    // filter: Decide if the answer should be compressed or not,
    // depending on the 'shouldCompress' function above
    filter: shouldCompress,
    // threshold: It is the byte threshold for the response
    // body size before considering compression, the default is 1 kB
    threshold: 0,
  })
);

// ////////////////////////////////////////////////////////
//        Root path  - opens the Dashboard Page         //
// ///////////////////////////////////////////////////////
app.get("/", (req, res, next) => {
  checkIfApiKEyIsPresent();

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

app.get("/info", (req, res, next) => {
  res.json({
    version: "2.0.0",
    message: "See https://github.com/Ckal/logviewer for more detials ... ",
  });
});

// get Raw current OnlineLog.log
app.get("/api/getRawLog", (req, res, next) => {
  // Check if the provided API key is valid
  if (req.query.key !== process.env.API_KEY) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  // Get the specified filename or use the default
  let filename = req.query.filename || "onlineLog";

  // Read the specified log file
  let rawdata = fs.readFileSync("./logs/"+filename+".log", "utf8");

  // Return the raw log data as text
  res.set("Content-Type", "text/plain");
  res.send(rawdata);
});
// API path to get current log, optimized for datatable.
app.get("/api/getDataTableLog", (req, res, next) => {
  // Check if the provided API key is valid
  if (req.query.key !== process.env.API_KEY) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  // Get the specified filename or use the default
  let filename = req.query.filename || "onlineLog";

  // Read the specified log file
  let rawdata = fs.readFileSync("./logs/"+filename+".log", "utf8");

  let data = JSON.stringify(rawdata);

  let obj = {
    data: [],
  };
  obj.data.push(rawdata);
  data = JSON.stringify(obj)
    .replaceAll('\\"', '"')
    .replaceAll("\\t", "")
    .replaceAll("\\n", "")
    .replaceAll("}{", "},{")
    .replaceAll('["{', "[{")
    .replaceAll('}"]', "}]")
    .replaceAll('":["', '":[');
  //res.json(data);
  //res.writeHead(200, { "Content-Type": "text/json" });
  res.write(data);
  res.end();
  return;
});
// API to delete the current log 
app.get("/api/deleteLog", (req, res, next) => {
  // Check if the provided API key is valid
  if (req.query.key !== process.env.API_KEY) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }
  // Get the specified filename or use the default
  let filename = req.query.filename || "onlineLog";
  // Read the specified log file
  fs.writeFile("./logs/"+filename+".log", "", function () {
  console.log("done");
  });
  res.send("Log deleted")
  return;
  });
// API to delete the current log 
app.delete("/api/deleteLog", (req, res, next) => {
  // Check if the provided API key is valid
  if (req.query.key !== process.env.API_KEY) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }
  // Get the specified filename or use the default
  let filename = req.query.filename || "onlineLog";
  // Read the specified log file
  fs.writeFile("./logs/"+filename+".log", "", function () {
    console.log("done");
  });
  res.send("Log deleted")
  return;
});

app.get("/logs", (req, res) => {
    // Check if the provided API key is valid
    if (req.query.key !== process.env.API_KEY) {
      res.status(401).json({ error: "Invalid API key" });
      return;
    }
  // Get a list of all files in the public/logs folder
  fs.readdir("./logs", (err, files) => {
    if (err) {
      res.status(500).json({ error: "Unable to read logs directory" });
      return;
    }

    // Filter out any non-log files
    const logFiles = files.filter((file) => file.endsWith(".log"));

    // Create HTML links for each log file
    let links = "";
    for (const file of logFiles) {
      links += `<a href="/${file}">${file}</a><br>`;
    }

    // Send the HTML links as the response
    res.send(links);
  });
});
// API path to save to current log
app.get("/api/saveLog", (req, res, next) => {
  // check if the API key is valid, only if available
  console.log(process.env.API_KEY);
  if (req.query.api_key !== process.env.API_KEY) {
    res.status(401).json({ message: "Invalid API key" });
    return;
  }
  // Get the specified filename or use the default
  let filename = req.query.filename || "onlineLog";

  // create a logger for the specified log file
  const logger = createLogger({
    transports: [
      new transports.File({
        filename: `logs/${req.query.log_file}.log`,
        format: customFormat,
        json: true,
        stringify: (obj) => JSON.stringify(obj),
      }),
      new transports.Console({
        format: customFormat,
      }),
    ],
  });

  // log the message to the specified log file
  logger.info(req.query.message);

  res.json({ message: "Log saved successfully" });
});
// API path to save to current log
app.post("/api/saveLog", (req, res, next) => {
  // check if the API key is valid, only if available
  console.log(process.env.API_KEY);
  if (req.body.api_key !== process.env.API_KEY) {
    res.status(401).json({ message: "Invalid API key" });
    return;
  }
  // Get the specified filename or use the default
  let filename = req.body.filename || "onlineLog";

  // create a logger for the specified log file
  const logger = createLogger({
    transports: [
      new transports.File({
        filename: `logs/${req.body.log_file}.log`,
        format: customFormat,
        json: true,
        stringify: (obj) => JSON.stringify(obj),
      }),
      new transports.Console({
        format: customFormat,
      }),
    ],
  });

  // log the message to the specified log file
  logger.info(req.body.message);

  res.json({ message: "Log saved successfully" });
});

app.get("/dashboard.js", (req, res, next) => {
  fs.readFile("./public/dashboard.js", function (err, data) {
    if (err) {
      appLogger.severe(
        `Server severer error in get dashboard.js  : ${err}!` + err
      );
      throw err;
    }
    res.writeHead(200, { "Content-Type": "text/javascript" });

    res.end(data);
    return;
  });
});
// Root path
app.get("/logViewerFrame", (req, res, next) => {
  fs.readFile("./public/logs.html", function (err, data) {
    if (err) {
      appLogger.severe(
        `Server severer error in logViewerFrame : ${err}!` + err
      );
      throw err;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
    return;
  });
});

app.listen(port, () => {
  appLogger.info("Server Started in port : ${port}!");
});

function checkIfApiKEyIsPresent() {
  if (!process.env.API_KEY) {
    console.log("API_KEY is not defined");
    return false;
  } else {
    console.log("API_KEY is defined");
    return true;
    // use process.env.API_KEY in your code
  }
}

