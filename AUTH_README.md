# Authentication System

This API uses Basic Authentication for securing endpoints.

## Available Users

The following users are configured in `config/users.json`:

| Username | Password    | Role  |
| -------- | ----------- | ----- |
| admin    | admin123    | admin |
| user1    | password123 | user  |
| testuser | test123     | user  |

## Authentication Endpoints

### Login (POST /api/auth/login)

Test credentials with JSON body:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Get Current User (GET /api/auth/me)

Requires Basic Authentication header.

## Using Basic Authentication

### With curl:

```bash
curl -u admin:admin123 http://localhost:3000/api/auth/me
```

### With Postman:

1. Go to Authorization tab
2. Select "Basic Auth"
3. Enter username and password

### With JavaScript (fetch):

```javascript
const credentials = btoa("admin:admin123");
fetch("http://localhost:3000/api/auth/me", {
  headers: {
    Authorization: "Basic " + credentials,
  },
});
```

## Protected Endpoints

All API endpoints under `/api/*` require authentication except:

- `/api/auth/login`
- `/api/auth/me` (requires auth to test)

## Modifying Users

To add or modify users, edit the `config/users.json` file and restart the server.
