# MediBid AI — Security & Compliance Architecture

## 1. Authentication & Session Security
- **Algorithm**: HS256 JWT tokens with 24-hour expiration.
- **Password Protection**: Passwords are salted and hashed using standard `bcrypt` with work factor 12. Plaintext passwords are never persisted or logged.
- **Role-Based Access Control (RBAC)**: Custom dependencies (`get_current_user`, `get_current_pharmacy`, `get_current_admin`) enforce strict role permissions across endpoints.

## 2. Data Protection & DPDP Act 2023 Principles
- **Purpose Limitation**: Prescription documents are processed strictly for extracting required medications for pharmacy quotations.
- **Data Minimization**: Competing pharmacies only receive needed drug names, quantities, and customer proximity radius during reverse auctions. Exact customer street address is withheld until an offer is formally selected.
- **Consent Architecture**: Patient acknowledges data sharing with verified local pharmacies prior to broadcast.

## 3. Clinical & Legal Safeguards
- **Mandatory Pharmacist Approval**: AI agents cannot authorize drug dispensing. Every order requires explicit approval by a registered pharmacist with license registration number logging.
- **Schedule H/H1/X Flagging**: Regulated medication schedules are detected and flagged for physical prescription verification at fulfillment.
- **Generic Substitution Boundaries**: Generic alternatives require bio-equivalence check and explicit customer & pharmacist authorization.

## 4. API & Network Security
- **CORS Constraints**: Explicit origin whitelist prevents cross-site request abuse.
- **Payload Sanitization**: Pydantic v2 validates all incoming payloads with strict type constraints.
- **File Validation**: MIME-type and size checks restrict uploads to JPG, PNG, and PDF formats under 10MB.
