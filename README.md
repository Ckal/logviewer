# loggviewer

A node.js application to store and view logs.


# Prerequisites

- Node.js
- NPM

# Quick start guide 

- Run `npm install` to installl dependencies
- Run `npm start` to start the local server
- Load `http://localhost:3000` to test the endpoint. It will display a json result `{"message":"See https://github.com/Ckal/logviewer for more detials ... "}`

# API Endpoints

## GET /
Some examples, usefull links, tipps and howto's.

```bash
curl --header "Content-Type: application/json" \
 --request GET \
 http://localhost:3000/
```

## GET /api/delteLog

Deltes the current log. For a fresh start

```bash
curl http://localhost:3000/api/delteLog
```

## GET /api/saveLog?message={"log.level":"info","timestamp":"today","message":"This is a usefull sample"} 

```bash
curl http://localhost:3000/api/saveLog?message={"log.level":"info","timestamp":"today","message":"This is a usefull sample"}
```

## GET /logViewer
See the logs in a nice table. The table columns are based on json attribute. -> You chose the columns by uploading json
```bash
curl http://localhost:3000/viewLog
```

## GET /viewRawLog
See the logs in a nice table. The table columns are based on json attribute. -> You chose the columns by uploading json
```bash
curl http://localhost:3000/viewRawLog
```
