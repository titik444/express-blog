# Comment API Specification

## Base URL

http://localhost:3000

## Create Comment (Authenticated user only)

Endpoint :

- POST {{BASE_URL}}/api/comment

Request

- Header :

  Content-Type: application/json
  Authorization: Bearer {token}

- Request Body

```json
{
  "postId": "cmei9jrdt0002u24wz05dtahz",
  "content": "This is the comment content."
}
```

Response

- Success (201)

```json
{
  "success": true,
  "message": "Comment created",
  "data": {
    "id": "cmeypliqd0001u2cwggvk7hkq",
    "postId": "cmei9jrdt0002u24wz05dtahz",
    "content": "This is the comment content.",
    "createdAt": "2025-08-30T20:23:27.253Z",
    "authorId": "cmeii3eid0000u2ewoir8g45a",
    "author": {
      "id": "cmeii3eid0000u2ewoir8g45a",
      "name": "Jane Doe",
      "avatarUrl": null
    }
  }
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Content is required"]
}
```

## Update Comment (Owner only)

Endpoint :

- PUT {{BASE_URL}}/api/comment/{id}

Request

- Header :

  Content-Type: application/json
  Authorization: Bearer {token}

- Request Body

```json
{
  "content": "This is the updated content."
}
```

Response

- Success (200)

```json
{
  "success": true,
  "message": "Comment updated",
  "data": {
    "id": "cmeypliqd0001u2cwggvk7hkq",
    "postId": "cmei9jrdt0002u24wz05dtahz",
    "content": "This is the updated content.",
    "createdAt": "2025-08-30T20:23:27.253Z",
    "authorId": "cmeii3eid0000u2ewoir8g45a",
    "author": {
      "id": "cmeii3eid0000u2ewoir8g45a",
      "name": "Jane Doe",
      "avatarUrl": null
    }
  }
}
```

- Error (404)

```json
{
  "success": false,
  "message": "comment not found"
}
```

## Delete Comment (Owner only)

Endpoint :

- DELETE {{BASE_URL}}/api/comment/{id}

Request

- Header :

  Content-Type: application/json

Response

- Success (200)

```json
{
  "success": true,
  "message": "Comment deleted"
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Comment not found"
}
```
