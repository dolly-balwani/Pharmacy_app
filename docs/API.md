# MediBid AI — API Specification

The REST API is built with FastAPI and exposed at `/api/v1`. Interactive Swagger documentation is available at `/docs` and OpenAPI schema at `/openapi.json`.

## Authentication & Authorization
All secured endpoints require an `Authorization: Bearer <token>` header. Roles supported: `customer`, `pharmacy`, `admin`.

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/auth/register` | POST | Public | Register new customer or pharmacy account |
| `/api/v1/auth/login` | POST | Public | Authenticate and receive JWT access token |
| `/api/v1/auth/me` | GET | Authenticated | Retrieve authenticated user profile |

## Prescriptions
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/prescriptions/upload` | POST | Customer | Upload JPG/PNG/PDF prescription document |
| `/api/v1/prescriptions` | GET | Customer | List user's uploaded prescriptions |
| `/api/v1/prescriptions/{id}` | GET | Authenticated | Retrieve prescription by ID |
| `/api/v1/prescriptions/{id}/process` | POST | Authenticated | Trigger AI OCR and medicine extraction |

## Pharmacies
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/pharmacies/register` | POST | Pharmacy | Register pharmacy details & licenses |
| `/api/v1/pharmacies/nearby` | GET | Public | Find verified pharmacies within radius |
| `/api/v1/pharmacies` | GET | Public | List verified pharmacies |
| `/api/v1/pharmacies/{id}` | GET | Public | Get specific pharmacy profile |

## Auctions & Real-Time Bidding
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/auctions` | POST | Customer | Create live bidding session for prescription |
| `/api/v1/auctions` | GET | Authenticated | List active/past auctions |
| `/api/v1/auctions/{id}` | GET | Authenticated | Retrieve auction state and incoming bids |
| `/api/v1/auctions/{id}/bids` | POST | Pharmacy | Submit itemized price quotation |
| `/api/v1/auctions/{id}/select-winner`| POST | Customer | Select winning bid and complete auction |
| `/ws/{auction_id}` | WS | Public | WebSocket channel for live incoming bids |

## Orders & Pharmacist Approval
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/orders` | POST | Customer | Convert winning bid into confirmed order |
| `/api/v1/orders` | GET | Authenticated | List orders for customer or pharmacy |
| `/api/v1/orders/{id}` | GET | Authenticated | Get detailed order status and items |
| `/api/v1/orders/{id}/status` | PATCH | Pharmacy/Admin| Update status through fulfillment stages |
| `/api/v1/orders/{id}/pharmacist-approval` | POST | Pharmacy | Mandatory registered pharmacist approval |
| `/api/v1/orders/{id}/pharmacist-rejection`| POST | Pharmacy | Pharmacist rejection with audit reason |

## AI Agents & Admin Intelligence
| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/v1/agents` | GET | Public | List 8 AI agents and their live operational status |
| `/api/v1/agents/logs` | GET | Public | Retrieve chronological execution logs |
| `/api/v1/admin/analytics` | GET | Admin/Public | Platform KPIs, win rates, and liquidity metrics |
| `/api/v1/admin/pharmacies` | GET | Admin | Pharmacy verification queue |
| `/api/v1/admin/compliance-exceptions` | GET | Admin | Regulatory and substitution flags |
