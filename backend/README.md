# Uber Clone - Backend API Documentation

## User Endpoints

### POST /user/register

#### Description
This endpoint registers a new user in the system. It accepts user credentials, validates them, hashes the password, creates a user account, and returns an authentication token.

#### Request

**Method:** `POST`

**Endpoint:** `/user/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullname": {
    "firstname": "string (required, minimum 3 characters)",
    "lastname": "string (optional, minimum 3 characters if provided)"
  },
  "email": "string (required, must be valid email format)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response

**Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john@example.com"
    }
  },
  "message": "User created Successfully"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 201 | Created | User successfully registered |
| 400 | Bad Request | Validation failed (invalid email, firstname < 3 chars, password < 6 chars) |
| 401 | Unauthorized | Missing required credentials (fullname, email, or password) |
| 500 | Internal Server Error | Server-side error during registration |

#### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| email | Must be valid email | "Invalid Email" |
| fullname.firstname | Minimum 3 characters | "first name must be atleast 3 characters long" |
| password | Minimum 6 characters | "Password must be 6 lettor long" |
| fullname | Required field | "all credentials are required" |
| email | Required field, must be unique | "all credentials are required" |
| password | Required field | "all credentials are required" |

#### Error Response Examples

**Validation Error (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "location": "body",
      "msg": "Invalid Email",
      "param": "email"
    }
  ]
}
```

**Missing Credentials (401):**
```json
{
  "success": false,
  "message": "all credentials are required"
}
```

#### Notes
- Passwords are hashed using bcrypt before storage
- Email must be unique in the system
- Authentication token is valid for future API requests
- The returned token should be used in the Authorization header for protected routes

---

### GET /user/profile

#### Description
Retrieves profile information for the authenticated user. Requires a valid `token` cookie set by login or register.

#### Request

**Method:** `GET`

**Endpoint:** `/user/profile`

**Headers:**
```
Cookie: token=<jwt_token_here>
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  },
  "message": "User profile fetched successfully"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 200 | OK | Profile retrieved successfully |
| 401 | Unauthorized | Missing or invalid token |
| 500 | Internal Server Error | Server-side error during fetch |

---

### POST /user/login

#### Description
Authenticates a user with email and password, returning a token and user data upon success.

#### Request

**Method:** `POST`

**Endpoint:** `/user/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, minimum 6 characters)"
}
```

#### Example Request
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "token": "jwt_token_here",
    "user": { /* user object */ }
  },
  "message": "Login successfully"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 200 | OK | User authenticated successfully |
| 400 | Bad Request | Validation failed or invalid credentials |
| 401 | Unauthorized | Wrong password or missing fields |
| 404 | Not Found | User not found |
| 500 | Internal Server Error | Server-side error during login |

---

### GET /user/logout

#### Description
Logs out the current user by clearing their stored token in the database and removing the cookie.

#### Request

**Method:** `GET`

**Endpoint:** `/user/logout`

**Headers:**
```
Cookie: token=<jwt_token_here>
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "User logged Out"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 200 | OK | User logged out and cookie cleared |
| 401 | Unauthorized | No authenticated user or invalid token |
| 500 | Internal Server Error | Server-side error during logout |

---

## Captain Endpoints

### POST /captain/register

#### Description
Registers a new captain and returns an authentication token.

#### Request

**Method:** `POST`

**Endpoint:** `/captain/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullname": { "firstname": "string (required, min 3)", "lastname": "string (optional)" },
  "email": "string (required, valid email)",
  "password": "string (required, min 6)",
  "vehicle": {
    "color": "string (required)",
    "plate": "string (required)",
    "capacity": "number (required, >=1)",
    "vehicleType": "string (required, one of car, motorcycle, auto)"
  }
}
```

#### Response

**Success Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "token": "jwt_token_here",
    "captain": { /* captain object */ }
  },
  "message": "Captain created Successfully"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 201 | Created | Captain registered successfully |
| 400 | Bad Request | Validation failed or email already exists |
| 500 | Internal Server Error | Server-side error during registration |


### POST /captain/login

#### Description
Authenticates a captain and returns a token and profile data.

#### Request

**Method:** `POST`

**Endpoint:** `/captain/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 6)"
}
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "token": "jwt_token_here",
    "captain": { /* captain object */ }
  },
  "message": "Login successfully"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 200 | OK | Captain authenticated successfully |
| 400 | Bad Request | Validation failed or invalid credentials |
| 500 | Internal Server Error | Server-side error during login |


### GET /captain/profile

#### Description
Fetches the profile of the authenticated captain. Requires valid cookie token.

#### Request

**Method:** `GET`

**Endpoint:** `/captain/profile`

**Headers:**
```
Cookie: token=<jwt_token_here>
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "captain": { /* captain object */ }
  },
  "message": "Captain profile fetched successfully"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 200 | OK | Profile retrieved successfully |
| 401 | Unauthorized | Token missing/invalid |
| 500 | Internal Server Error | Server-side error during fetch |


### GET /captain/logout

#### Description
Logs out the captain by clearing the token cookie and removing server-side token.

#### Request

**Method:** `GET`

**Endpoint:** `/captain/logout`

**Headers:**
```
Cookie: token=<jwt_token_here>
```

#### Response

**Success Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Logout successfully"
}
```

#### Status Codes

| Status Code | Description | Scenario |
|-------------|-------------|----------|
| 200 | OK | Captain logged out successfully |
| 401 | Unauthorized | No authenticated captain or invalid token |
| 500 | Internal Server Error | Server-side error during logout |


