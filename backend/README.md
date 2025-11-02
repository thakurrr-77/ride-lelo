## Description

Creates a new user account. The endpoint validates the incoming payload and, on success, returns a JWT token plus the created user object.

## HTTP Method

POST /users/register

## Request body

JSON body with the following shape:

```json
{
  "fullname": {
    "firstname": "string", 
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

Notes:

- `fullname.firstname` — required, minimum length 3 characters.
- `fullname.lastname` — optional, if present minimum length 3 characters.
- `email` — required, must be a valid email address.
- `password` — required, minimum length 6 characters.

## Example response (success)

Status: 201 Created

```json
{
  "token": "<JWT token string>",
  "user": {
    "_id": "<user id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null
  }
}
```

## Example response (validation error)

Status: 400 Bad Request

When validation fails, the endpoint returns an `errors` array produced by `express-validator`. Example:

```json
{
  "errors": [
    {
      "msg": "InvalidEmail",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name should be at least 3 character long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

### Example response (server error)

Status: 500 Internal Server Error

When an unexpected error occurs on the server (database, hashing, or token generation failure), a generic error response may be returned. Example:

```json
{
  "error": "Internal server error"
}
```

---

---

## Login

### Description

Authenticates an existing user using email and password. On success, returns a JWT token and the user object.

### HTTP Method

POST /users/login

### Request body

```json
{
  "email": "string",
  "password": "string"
}
```

Notes:

- `email` — required, must be a valid email address.
- `password` — required, minimum length 6 characters.

### Example response (success)

Status: 200 OK

```json
{
  "token": "<JWT token string>",
  "user": {
    "_id": "<user id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null
  }
}
```

### Example response (validation error)

Status: 400 Bad Request

When validation fails for login input (e.g., invalid email format or short password):

```json
{
  "errors": [
    {
      "msg": "InvalidEmail",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password should be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Example response (authentication error)

Status: 401 Unauthorized

When credentials are invalid (wrong email or password), the API returns an authentication error. Example:

```json
{
  "message": "Invalid email or password"
}
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Profile

### Description

Returns the authenticated user's profile information. This endpoint is protected and requires a valid JWT (sent as `Authorization: Bearer <token>` or as a cookie).

### HTTP Method

GET /users/profile

### Request body

None.

### Example response (success)

Status: 200 OK

```json
{
  "user": {
    "_id": "<user id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "socketId": null
  }
}
```

### Example response (no token / unauthorized)

Status: 401 Unauthorized

```json
{
  "message": "Access denied. No token provided"
}
```

### Example response (invalid token / authentication)

Status: 401 Unauthorized

```json
{
  "message": "Invalid token"
}
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Logout

### Description

Logs out the authenticated user. Implementation may blacklist the current JWT (so it cannot be used again) and/or clear the auth cookie. This endpoint is protected and requires a valid JWT.

### HTTP Method

GET /users/logout

### Request body

None.

### Example response (success)

Status: 200 OK

```json
{
  "message": "Logged out successfully"
}
```

### Example response (no token / unauthorized)

Status: 401 Unauthorized

```json
{
  "message": "Access denied. No token provided"
}
```

### Example response (token blacklisted / unauthorized)

Status: 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```
