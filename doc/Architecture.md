# Architecture Overview

This document describes the high-level architecture of the Healix platform,
including service responsibilities, data stores, and communication patterns.

---

## System Architecture

Healix follows a microservices architecture with an **API Gateway pattern**.

- **Synchronous communication:** REST APIs
- **Asynchronous communication:** RabbitMQ (event-driven)

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
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  User  │ │Product │ │ Order  │ │ Admin  │
│Service │ │Catalog │ │  Cart  │ │  CMS   │
└────────┘ └────────┘ └────────┘ └────────┘
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
## Data Stores

| Technology    | Usage                                                 |
| ------------- | ----------------------------------------------------- |
| MongoDB       | Users, health profiles, products, categories, reviews |
| Redis         | Rate limiting, login attempts, carts, reservations    |
| DynamoDB      | Orders, payments, refunds                             |
| Elasticsearch | Product search and filtering                          |


## Key Design Decisions

- API Gateway centralizes authentication and authorization
- Services remain focused on business logic
- Event-driven workflows improve scalability
- Read-heavy operations are optimized using Redis and Elasticsearch
