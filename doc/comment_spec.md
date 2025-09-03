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
    "content": "This is the comment content.",
    "isLiked": false,
    "likeCount": 0,
    "createdAt": "2025-08-30T20:23:27.253Z",
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

## Get Comments By Id

Endpoint :

- GET {{BASE_URL}}/api/comment/{id}

Request

- Header :

  Content-Type: application/json
  Authorization: Bearer {token} (OPTIONAL)

Response

- Success (200)

```json
{
  "success": true,
  "message": "Comment fetched",
  "data": {
    "id": "cmf0upb5e0003u2workx82lsc",
    "content": "This is the comment",
    "isLiked": false,
    "likeCount": 0,
    "createdAt": "2025-09-01T08:21:54.183Z",
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
  "message": "Comment not found"
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
    "content": "This is the updated content.",
    "isLiked": false,
    "likeCount": 0,
    "createdAt": "2025-08-30T20:23:27.253Z",
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
  Authorization: Bearer {token}

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

## Like Comment (Authenticated user only)

Endpoint :

- POST {{BASE_URL}}/api/comment/{id}/like

Request

- Header :

  Content-Type: application/json
  Authorization: Bearer {token}

Response

- Success (200)

```json
{
  "success": true,
  "message": "Comment liked"
}
```

- Error (400)

```json
{
  "success": false,
  "message": "You already liked this comment"
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Comment not found"
}
```

## Unlike Comment (Authenticated user only)

Endpoint :

- DELETE {{BASE_URL}}/api/comment/{id}/unlike

Request

- Header :

  Content-Type: application/json
  Authorization: Bearer {token}

Response

- Success (200)

```json
{
  "success": true,
  "message": "Comment unliked"
}
```

- Error (400)

```json
{
  "success": false,
  "message": "You have not liked this comment"
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Comment not found"
}
```
