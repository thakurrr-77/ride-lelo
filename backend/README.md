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
