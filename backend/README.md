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
# Auth (User routes)

This section documents the user (auth) related endpoints. Each endpoint follows the pattern: Description → HTTP method → Request body → Example response(s).

---

## Register

### Description

Creates a new user account. The endpoint validates the incoming payload and, on success, returns a JWT token plus the created user object.

### HTTP Method

POST /users/register

### Request body

```json
{
  "fullname": { "firstname": "string", "lastname": "string" },
  "email": "string",
  "password": "string"
}
```

Notes:

- `fullname.firstname` — required, minimum length 3 characters.
- `email` — required and must be a valid email.
- `password` — required, minimum length 6 characters.

### Example response (success)

Status: 201 Created

```json
{
  "token": "<JWT token string>",
  "user": { "_id": "<user id>", "fullname": { "firstname": "John", "lastname": "Doe" }, "email": "john@example.com", "socketId": null }
}
```

### Example response (validation error)

Status: 400 Bad Request

```json
{ "errors": [ { "msg": "InvalidEmail", "param": "email", "location": "body" } ] }
```

### Example response (user exists)

Status: 400 Bad Request

```json
{ "message": "User with this email already exists" }
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{ "error": "Internal server error" }
```

---

## Login

### Description

Authenticates an existing user using email and password. On success, returns a JWT token and the user object (also sets a `token` cookie).

### HTTP Method

POST /users/login

### Request body

```json
{ "email": "string", "password": "string" }
```

### Example response (success)

Status: 200 OK

```json
{ "token": "<JWT token string>", "user": { "_id": "<user id>", "fullname": { "firstname": "John", "lastname": "Doe" }, "email": "john@example.com", "socketId": null } }
```

### Example response (validation error)

Status: 400 Bad Request

```json
{ "errors": [ { "msg": "InvalidEmail", "param": "email", "location": "body" } ] }
```

### Example response (authentication error)

Status: 400 or 401

- If email is not found: 400 Bad Request
- If password mismatch: 401 Unauthorized

Example:

```json
{ "message": "Invalid email or password" }
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{ "error": "Internal server error" }
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
{ "user": { "_id": "<user id>", "fullname": { "firstname": "John", "lastname": "Doe" }, "email": "john@example.com", "socketId": null } }
```

### Example response (no token / unauthorized)

Status: 401 Unauthorized

```json
{ "message": "Access denied. No token provided" }
```

### Example response (invalid token / authentication)

Status: 401 Unauthorized

```json
{ "message": "Invalid token" }
```

### Example response (not found)

Status: 404 Not Found

```json
{ "message": "User not found" }
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{ "error": "Internal server error" }
```

---

## Logout

### Description

Logs out the authenticated user. Implementation blacklists the current JWT and clears the auth cookie.

### HTTP Method

GET /users/logout

### Request body

None.

### Example response (success)

Status: 200 OK

```json
{ "message": "Logged out successfully" }
```

### Example response (no token / unauthorized)

Status: 401 Unauthorized

```json
{ "message": "Access denied. No token provided" }
```

### Example response (token blacklisted / unauthorized)

Status: 401 Unauthorized

```json
{ "message": "Unauthorized" }
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{ "error": "Internal server error" }
```

---

# Captian (Driver) routes

This section documents routes related to captians (drivers).

---

## Captian Register

### Description

Registers a new captian (driver) including vehicle details. The endpoint validates the incoming payload and on success returns a JWT token and the created captian object.

### HTTP Method

POST /captian/register

### Request body

```json
{
  "fullname": { "firstname": "string", "lastname": "string" },
  "email": "string",
  "password": "string",
  "vehicle": { "plate": "string", "color": "string", "capacity": number, "vehicleType": "car|motercycle|auto" }
}
```

Notes / validation rules (based on route validators and model):

- `fullname.firstname` — required, minimum length 3 characters.
- `email` — required, must be a valid email and is unique.
- `password` — required, minimum length 6 characters.
- `vehicle.color` — required, minimum length 3 characters.
- `vehicle.plate` — required, minimum length 3 characters and unique.
- `vehicle.capacity` — required, integer, minimum 1.
- `vehicle.vehicleType` — required, one of `car`, `motercycle`, or `auto`.

### Example response (success)

Status: 201 Created

```json
{ "token": "<JWT token string>", "captian": { "_id": "<captian id>", "fullname": { "firstname": "John", "lastname": "Doe" }, "email": "john@example.com", "vehicle": { "plate": "AB1234", "color": "red", "capacity": 4, "vehicleType": "car" }, "status": "inactive", "socketId": null } }
```

### Example response (validation error)

Status: 400 Bad Request

```json
{ "errors": [ { "msg": "First name should be at least 3 character", "param": "fullname.firstname", "location": "body" } ] }
```

### Example response (conflict / unique constraint)

Status: 409 Conflict

```json
{ "message": "Email or vehicle plate already exists" }
```

### Example response (server error)

Status: 500 Internal Server Error

```json
{ "error": "Internal server error" }
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
