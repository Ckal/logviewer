const { createLogger, format, transports } = require("winston");

const customFormat = format.combine(
  format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
  format.align(),
  format.printf(
    (i) =>
      `{"timstamp" : "${[i.timestamp]}", "level" : "${i.level}", "message": "${
        i.message
      }"}`
  )
);

const onlineFormat = format.combine(format.printf((i) => `${i.message}`));

const onlineLogger = createLogger({
  transports: [
    new transports.File({
      filename: "logs/onlineLog.log",
      format: onlineFormat,
    }),
    new transports.Console({
      format: onlineFormat,
    }),
  ],
});

const appLogger = createLogger({
  transports: [
    new transports.File({
      filename: "logs/appLog.log",
      format: customFormat,
      json: true,
      stringify: (obj) => JSON.stringify(obj),
    }),
    new transports.Console({
      format: customFormat,
    }),
  ],
});

module.exports = {
  onlineLogger: onlineLogger,
  appLogger: appLogger,
};
