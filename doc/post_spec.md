# Post API Specification

## Base URL

http://localhost:3000

## Create Post (Authenticated user only)

Endpoint :

- POST {{BASE_URL}}/api/post

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

- Request Body

```json
{
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "featuredImage": "https://example.com/image.jpg",
  "categories": ["cmei9jrdt0002u24wz05dtahz", "cmei9jrdu0003u24wdn5yj1it"]
}
```

Response

- Success (201)

```json
{
  "success": true,
  "message": "Post created",
  "data": {
    "id": "cmeyqfkze0001u26g8pfi7giu",
    "title": "My First Post",
    "slug": "my-first-post8",
    "content": "This is the content of my first post.",
    "featuredImage": "https://example.com/image.jpg",
    "isLiked": false,
    "likeCount": 0,
    "createdAt": "2025-08-30T20:46:49.849Z",
    "author": {
      "id": "cmeii3eid0000u2ewoir8g45a",
      "name": "Jane Doe",
      "avatarUrl": null
    },
    "categories": [
      {
        "id": "cmei9jrdt0002u24wz05dtahz",
        "name": "Technology",
        "slug": "technology"
      },
      {
        "id": "cmei9jrdu0003u24wdn5yj1it",
        "name": "Lifestyle",
        "slug": "lifestyle"
      }
    ]
  }
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Title is required"]
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Post with similar title already exists"
}
```

## List Post

Endpoint :

- GET {{BASE_URL}}/api/post

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token} (OPTIONAL)

Query Params

- page (default 1)
- limit (default 10)
- search (optional)

Response

- Success (200)

```json
{
  "success": true,
  "message": "Posts fetched",
  "data": {
    "items": [
      {
        "id": "cmeypsd270001u2r47b4ac06u",
        "title": "My Second Post",
        "slug": "my-second-post",
        "content": "This is the content of my second post.",
        "featuredImage": "https://example.com/image.jpg",
        "isLiked": false,
        "likeCount": 0,
        "createdAt": "2025-08-30T20:28:46.495Z",
        "categories": [
          {
            "id": "cmei9jrdt0002u24wz05dtahz",
            "name": "Technology",
            "slug": "technology"
          }
        ],
        "author": {
          "id": "cmeii3eid0000u2ewoir8g45a",
          "name": "Jane Doe",
          "avatarUrl": null
        }
      },
      {
        "id": "cmeypliqd0001u2cwggvk7hkq",
        "title": "My First Post",
        "slug": "my-first-post",
        "content": "This is the content of my first post.",
        "featuredImage": "https://example.com/image.jpg",
        "isLiked": false,
        "likeCount": 0,
        "createdAt": "2025-08-30T20:23:27.253Z",
        "categories": [
          {
            "id": "cmei9jrdt0002u24wz05dtahz",
            "name": "Technology",
            "slug": "technology"
          },
          {
            "id": "cmei9jrdu0003u24wdn5yj1it",
            "name": "Lifestyle",
            "slug": "lifestyle"
          }
        ],
        "author": {
          "id": "cmeii3eid0000u2ewoir8g45a",
          "name": "Jane Doe",
          "avatarUrl": null
        }
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10
  }
}
```

## Get Post by Slug

Endpoint :

- GET {{BASE_URL}}/api/post/{slug}

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token} (OPTIONAL)

Response

- Success (200)

```json
{
  "success": true,
  "message": "Post fetched",
  "data": {
    "id": "cmei9jreg0006u24wsqw4clyk",
    "title": "Welcome to My Blog",
    "slug": "welcome-to-my-blog",
    "content": "This is the very first post seeded into the blog.",
    "featuredImage": "https://picsum.photos/800/400",
    "isLiked": false,
    "likeCount": 0,
    "createdAt": "2025-08-19T08:09:52.504Z",
    "author": {
      "id": "cmei9jrci0000u24w70vn7pmj",
      "name": "Super Admin",
      "avatarUrl": "https://i.pravatar.cc/150?img=1"
    },
    "categories": [
      {
        "id": "cmei9jrdt0002u24wz05dtahz",
        "name": "Technology",
        "slug": "technology"
      },
      {
        "id": "cmei9jrdu0003u24wdn5yj1it",
        "name": "Lifestyle",
        "slug": "lifestyle"
      }
    ],
    "comments": [
      {
        "id": "cmei9jrez0008u24wdz8515ex",
        "content": "This is a seeded comment from John Doe",
        "isLiked": false,
        "likeCount": 0,
        "createdAt": "2025-08-19T08:09:52.524Z",
        "author": {
          "id": "cmei9jrdf0001u24wpoagtxik",
          "name": "John Doe",
          "avatarUrl": "https://i.pravatar.cc/150?img=2"
        }
      }
    ]
  }
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Post not found"
}
```

## Update Post (Owner only)

Endpoint :

- PATCH {{BASE_URL}}/api/post/{id}

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

- Request Body

```json
{
  "title": "My Updated Post",
  "content": "This is the updated content.",
  "featuredImage": "https://example.com/new-image.jpg",
  "categories": ["cmei9jrdt0002u24wz05dtahz"]
}
```

Response

- Success (200)

```json
{
  "success": true,
  "message": "Post updated",
  "data": {
    "id": "cmeypliqd0001u2cwggvk7hkq",
    "title": "My Updated Post",
    "slug": "my-updated-post",
    "content": "This is the content of my first post.",
    "featuredImage": "https://example.com/new-image.jpg",
    "isLiked": false,
    "likeCount": 0,
    "createdAt": "2025-08-30T20:23:27.253Z",
    "categories": [
      {
        "id": "cmei9jrdt0002u24wz05dtahz",
        "name": "Technology",
        "slug": "technology"
      }
    ],
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
  "message": "post not found"
}
```

## Delete Post (Owner only)

Endpoint :

- DELETE {{BASE_URL}}/api/post/{id}

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

Response

- Success (200)

```json
{
  "success": true,
  "message": "Post deleted"
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Post not found"
}
```

## Like Post (Authenticated user only)

Endpoint :

- POST {{BASE_URL}}/api/post/{id}/like

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

Response

- Success (200)

```json
{
  "success": true,
  "message": "Post liked"
}
```

- Error (400)

```json
{
  "success": false,
  "message": "You already liked this post"
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Post not found"
}
```

## Unlike Post (Authenticated user only)

Endpoint :

- DELETE {{BASE_URL}}/api/post/{id}/unlike

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

Response

- Success (200)

```json
{
  "success": true,
  "message": "Post unliked"
}
```

- Error (400)

```json
{
  "success": false,
  "message": "You have not liked this post"
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Post not found"
}
```
