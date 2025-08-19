# Auth API Specification

## Base URL

http://localhost:3000

## Register

Endpoint :

- POST {{BASE_URL}}/api/auth/register

Request

- Header :

  Content-Type: application/json

- Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword@123"
}
```

Response

- Success (201)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "cmeim7rey0000u2dob0y1d8qx",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Name is required", "Email is required", "Password is required"]
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Password must be at least 6 characters"]
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Email already in use"
}
```

## Login User

Endpoint :

- POST {{BASE_URL}}/api/auth/login

Request

- Header :

  Content-Type: application/json

- Request Body

```json
{
  "email": "john@example.com",
  "password": "StrongPassword@123"
}
```

Response

- Success (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "cmeii3eid0000u2ewoir8g45a",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "USER",
    "token": "xxxxxxxxxxxxxxxxxxxxx",
    "refreshToken": "xxxxxxxxxxxxxxxxxxxxx"
  }
}
```

- Error (401)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```
