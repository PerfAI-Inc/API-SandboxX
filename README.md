# PerfAI Test Endpoints

A simple Node.js server providing various test endpoints for performance testing.

## Setup

1. Install dependencies:

```
npm install
```

2. Start the server:

```
npm start
```

For development with auto-restart:

```
npm run dev
```

The server will run on port 3000 by default (configurable via PORT environment variable).

## Available Endpoints

| Endpoint                       | Method | Description                                    |
| ------------------------------ | ------ | ---------------------------------------------- |
| `/`                            | GET    | API documentation                              |
| `/api/test/simple`             | GET    | Simple 200 OK response                         |
| `/api/test/delay/:ms`          | GET    | Response with specified delay in ms            |
| `/api/test/echo`               | POST   | Echoes back the request body                   |
| `/api/test/largepayload/:size` | GET    | Returns payload with specified number of items |
| `/api/test/cpu/:load`          | GET    | Simulates CPU load (higher number = more load) |
| `/api/test/status/:code`       | GET    | Returns specified HTTP status code             |

### Patient History Record Endpoints

| Endpoint                                    | Method | Description                             |
| ------------------------------------------- | ------ | --------------------------------------- |
| `/patient/history/record`                   | GET    | Get patient history record              |
| `/patient/history/record/modify`            | POST   | Create patient history record           |
| `/patient/history/record/modify/:id`        | DELETE | Delete patient history record           |
| `/patient/history/record/update/:id`        | PUT    | Update patient history record           |
| `/patient/history/record/update/modify/:id` | PATCH  | Partially update patient history record |

## Examples

### Simple Request

```
GET http://localhost:3000/api/test/simple
```

### Delayed Response (2 seconds)

```
GET http://localhost:3000/api/test/delay/2000
```

### Echo Request

```
POST http://localhost:3000/api/test/echo
Content-Type: application/json

{
  "message": "Hello, world!",
  "user": "tester"
}
```

### Large Payload (500 items)

```
GET http://localhost:3000/api/test/largepayload/500
```

### CPU Intensive Operation

```
GET http://localhost:3000/api/test/cpu/200
```

### Custom Status Code

```
GET http://localhost:3000/api/test/status/404
```

### Patient Record Examples

#### Get Patient Record

```
GET http://localhost:3000/patient/history/record
```

#### Create Patient Record

```
POST http://localhost:3000/patient/history/record/modify
Content-Type: application/json

{
  "patientName": "John Doe",
  "age": 45,
  "condition": "Hypertension",
  "notes": "Regular checkup required"
}
```

#### Delete Patient Record

```
DELETE http://localhost:3000/patient/history/record/modify/123456
```

#### Update Patient Record

```
PUT http://localhost:3000/patient/history/record/update/123456
Content-Type: application/json

{
  "patientName": "John Doe",
  "age": 46,
  "condition": "Hypertension, Diabetes",
  "notes": "Monthly checkup required"
}
```

#### Partially Update Patient Record

```
PATCH http://localhost:3000/patient/history/record/update/modify/123456
Content-Type: application/json

{
  "condition": "Hypertension, Diabetes",
  "notes": "Monthly checkup required"
}
```

## Use Cases

These endpoints are designed to test various performance characteristics:

- Response time (baseline and under delay)
- Throughput capabilities
- CPU-intensive operations handling
- Large data payload handling
- Error status code handling
- RESTful CRUD operations (via patient history endpoints)
