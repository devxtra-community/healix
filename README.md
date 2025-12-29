## Healix – Nutrition E-Commerce Platform

Healix is a nutrition and health–focused e-commerce platform built using a microservices architecture.  
The system is designed to support personalized nutrition products, health profiles, and scalable order processing, while maintaining a clean separation of concerns across services.

---

## Architecture Overview

Healix follows a microservices architecture with an **API Gateway pattern**.  
Services communicate through **REST APIs** for synchronous operations and **RabbitMQ** for asynchronous, event-driven workflows.

```text
┌─────────────┐
│   Next.js   │
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│           API Gateway                    │
│  - JWT Authentication                   │
│  - Rate Limiting (Redis)                │
│  - Role-Based Access Control            │
│  - Request Routing                      │
└───┬─────────┬──────────┬─────────┬──────┘
    │         │          │         │
    ▼         ▼          ▼         ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌────────┐
│  User  │ │Product│ │ Order  │ │ Admin  │
│Service │ │Catalog│ │  Cart  │ │  CMS   │
└────────┘ └──────┘ └────────┘ └────────┘
    │         │          │         │
    └─────────┴──────────┴─────────┘
                   │
            ┌──────▼──────┐
            │  RabbitMQ   │
            │   Events    │
            └──────┬──────┘
                   │
            ┌──────▼──────┐
            │   Workers   │
            └─────────────┘

```

---

## Data Stores

| Technology        | Usage |
|------------------|-------|
| MongoDB          | Users, health profiles, products, categories, reviews |
| Redis            | Rate limiting, login attempts, carts, reservations |
| DynamoDB         | Orders, payments, refunds |
| Elasticsearch    | Product search and filtering |

---

## Repository Structure



## Repository Structure

```text
healix/
├── gateway/                     # API Gateway
├── services/
│   ├── user-service/            # Users, auth, profiles, reviews
│   ├── product-catalog-service/ # Products, categories, nutrition data
│   ├── order-cart-service/      # Cart, orders, payments, refunds
│   └── admin-cms-service/       # Admin & CMS operations
├── workers/                     # Background workers
├── frontend/                    # Next.js frontend
└── README.md
```


---

## Authentication & Authorization

### Authentication
- JWT-based authentication
- Access token (short-lived)
- Refresh token (stored securely)
- Tokens issued by User Service
- Tokens verified by API Gateway

Example JWT payload:

```json
{
  "sub": "<userId>",
  "role": "user | admin"
}
```

### Authorization (Gateway-Level)

Authorization is enforced only at the API Gateway.

| Role  | Allowed Access                        |
| ----- | ------------------------------------- |
| USER  | Health profile, cart, orders, reviews |
| ADMIN | Admin, CMS, configuration endpoints   |


Admin cannot access user health profiles or reviews

Services trust the gateway and do not re-check JWTs

## User Service

Port: 4001
Database: MongoDB

Responsibilities

User registration & login

Password hashing & rotation

Health profile management

Address management

Product reviews (verified purchase only)

Refresh token management

## Local Development Setup
Prerequisites

Node.js 18+

npm / pnpm
### Enable pnpm (if not already enabled):
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
## Start Infrastructure

Starts:

MongoDB

Redis

RabbitMQ

Elasticsearch

DynamoDB Local

### Start Services

## API Gateway
cd gateway
pnpm install
pnpm run dev

## User Service
cd services/user-service
pnpm install
pnpm run dev

### Health Check Endpoints

| Service         | Endpoint      |
| --------------- | ------------- |
| API Gateway     | `GET /health` |
| User Service    | `GET /health` |

## Design Notes

Authentication & authorization are centralized

Services remain lightweight and focused

Event-driven workflows enable scalability

Nutrition-focused domain modeling

Designed for learning, extensibility, and real-world patterns
