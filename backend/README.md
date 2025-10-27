# Users API

This document describes the POST /users/register endpoint implemented in this service.

## POST /users/register

Creates a new user account. The endpoint performs validation on the incoming payload and returns a JWT token and the created user on success.

- URL: /users/register
- Method: POST
- Content-Type: application/json

### Request body

The endpoint expects a JSON body with the following shape:

{
  "fullname": {
    "firstname": "string",   // required, min length 3
    "lastname": "string"     // optional, min length 3 if provided
  },
  "email": "string",        // required, must be a valid email
  "password": "string"      // required, min length 6
}

Notes about validations (based on server-side validators):
- `fullname.firstname`: required, minimum length 3 characters.
- `fullname.lastname`: optional, if present minimum length 3 characters.
- `email`: required and must be a valid email format.
- `password`: required and must be at least 6 characters long.

### Successful response

- Status: 201 Created
- Content-Type: application/json

Response body example:

{
  "token": "<JWT token string>",
  "user": {
    "_id": "<user id>",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "socketId": null
  }
}

The `token` can be used for authenticated requests to other endpoints.

### Validation errors

- Status: 400 Bad Request
- Content-Type: application/json

Response body example when validation fails (array of error objects):

{
  "errors": [
    { "msg": "InvalidEmail", "param": "email", "location": "body" },
    { "msg": "Password should be at least 6 characters long", "param": "password", "location": "body" }
  ]
}

### Other errors

- Status: 500 Internal Server Error — when user creation or hashing fails unexpectedly.

Response body example:

{
  "error": "Internal server error"
}

### Notes / Implementation details

- Passwords are hashed using bcrypt before being persisted (see `models/user.model.js`).
- A JWT is signed using the `JWT_SECRETE` environment variable.
- The endpoint is implemented and wired in `routes/user.routes.js` and handled in `controllers/user.controller.js`.
