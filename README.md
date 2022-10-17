# logger-demo

A Basic Node.js/Express REST API implementation example for logging.

# Prerequisites

- Node.js
- NPM

# Usage

- Run `npm install` to installl dependencies
- Run `npm start` to start the local server
- Load `http://localhost:3000` to test the endpoint. It will display a json result `{"message":"Ok"}`

# API Endpoints

## POST /auth/signup

user signup

```bash
curl --header "Content-Type: application/json" \
 --request POST \
 --data '{"email":"yasas@gmail.com","password":"xyz"}' \
 http://localhost:3000/auth/signup
```

## GET /api/users

Get a list of users -Not Authenticated

```bash
curl http://localhost:3000/api/users
```

Get a list of users - Authenticated

```bash
curl --header "Authorization: Bearer token" \
 --request GET \
 http://localhost:3000/api/users | json_pp
```
