# Category API Specification

## Base URL

http://localhost:3000

## Create Category with ADMIN role

Endpoint :

- POST {{BASE_URL}}/api/category

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

- Request Body

```json
{
  "name": "Technology"
}
```

Response

- Success (201)

```json
{
  "success": true,
  "message": "Category created",
  "data": {
    "id": "cmemnm9cw0000u29s1i2xxdl8",
    "name": "Technology",
    "slug": "technology"
  }
}
```

- Error (403)

```json
{
  "success": false,
  "message": "Forbidden: insufficient role"
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Category name is required"]
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Category already exists"
}
```

## List Category

Endpoint :

- GET {{BASE_URL}}/api/category

Request

- Header :

  Content-Type: application/json

Query Params

- page (default 1)
- limit (default 10)
- search (optional)

Response

- Success (200)

```json
{
  "success": true,
  "message": "Categories fetched",
  "data": {
    "items": [
      {
        "id": "cmei9jrdt0002u24wz05dtahz",
        "name": "Technology",
        "slug": "technology",
        "createdAt": "2025-08-19T08:09:52.481Z"
      },
      {
        "id": "cmei9jrdu0003u24wdn5yj1it",
        "name": "Lifestyle",
        "slug": "lifestyle",
        "createdAt": "2025-08-19T08:09:52.481Z"
      },
      {
        "id": "cmei9jrdv0004u24w4v8ljbuk",
        "name": "Business",
        "slug": "business",
        "createdAt": "2025-08-19T08:09:52.481Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 10
  }
}
```

## Get Category by Slug

Endpoint :

- GET {{BASE_URL}}/api/category/{slug}

Request

- Header :

  Content-Type: application/json

Response

- Success (200)

```json
{
  "success": true,
  "message": "Category fetched",
  "data": {
    "id": "cmei9jrdt0002u24wz05dtahz",
    "name": "Technology",
    "slug": "technology",
    "createdAt": "2025-08-19T08:09:52.481Z"
  }
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Category not found"
}
```

## Update Category with ADMIN role

Endpoint :

- PUT {{BASE_URL}}/api/category/{id}

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

- Request Body

```json
{
  "name": "Tech Updated"
}
```

Response

- Success (200)

```json
{
  "success": true,
  "message": "Category updated",
  "data": {
    "id": "cmemnm9cw0000u29s1i2xxdl8",
    "name": "Tech Updated",
    "slug": "tech-updated",
    "createdAt": "2025-08-22T09:54:48.416Z"
  }
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Category not found"
}
```

- Error (403)

```json
{
  "success": false,
  "message": "Forbidden: insufficient role"
}
```

- Error (400)

```json
{
  "success": false,
  "message": "Category already exists"
}
```

## Delete Category with ADMIN role

Endpoint :

- DELETE {{BASE_URL}}/api/category/{id}

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {token}

Response

- Success (200)

```json
{
  "success": true,
  "message": "Category deleted"
}
```

- Error (404)

```json
{
  "success": false,
  "message": "Category not found"
}
```

- Error (403)

```json
{
  "success": false,
  "message": "Forbidden: insufficient role"
}
```
