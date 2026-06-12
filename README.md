# Freight Management Platform

A full-stack logistics and freight marketplace designed to handle the end-to-end shipping lifecycle. This repository contains the backend API and the web-based dashboards for clients and transporters. The platform allows clients to post shipments and transporters to submit competitive bids, with the backend enforcing state transitions from posting through final delivery.

> **📱 Mobile App:** The Flutter-based driver application that pairs with this backend is maintained in a separate repository: **[Freight Driver App](https://github.com/w-2006-aksh/freight-driver-app)**.

## Tech Stack

- **Frontend Portals:** React.js
- **Backend API:** Node.js, Express.js
- **Database:** MongoDB, Redis
- **Queue:** BullMQ

## System Architecture & Core Features

### Gated Marketplace & Selective Bidding

- **Trusted Transporter Lists:** Clients maintain a custom, verified list of trusted transporters. Only transporters explicitly added to a client's trusted network are authorized to view and submit bids on their shipments.
- **Document Verification:** The platform incorporates document verification workflows for manual reference. When submitting a bid, transporters provide the assigned driver's phone number, driving license, vehicle number, and vehicle registration papers. While not strictly enforced by the system, this provides clients with crucial manual validation before accepting a bid.
- **Automated Bid Intimation:** Once a client selects a winning bid, the backend automatically dispatches an SMS notification to the selected transporter to initiate the trip workflow.

### Custom Role-Based Authentication

- Implemented a custom identity layer without third-party providers, giving explicit control over role scoping across client and transporter portals.
- Utilizes bcrypt-hashed credentials and JWT authorization.
- Login pipelines utilize manual OTP verification, with the authentication OTPs securely managed and stored in Redis.

### Deep-Linked Driver Handoff

- Once a transporter assigns a driver, the driver receives an SMS containing a JWT-secured deep link.
- Opening this link bootstraps the Flutter driver app and seamlessly assigns the active trip.
- The active-trip state is persisted locally on the device, ensuring the session survives app closures, device restarts, and intermittent highway connectivity.

### Trip State & GPS Polling

- Drivers manually mark lifecycle transitions (e.g., "Picked Up"), which immediately update the backend state machines.
- During transit, the app utilizes a poll-based GPS tracking pipeline. It periodically uploads coordinates which are server-side reverse-geocoded into city-level checkpoints with timestamps.
- The client dashboard renders this data as a chronological, city-to-city timeline suited for multi-day hauls.

### Persistent Delivery Verification

- Designed an OTP-gated delivery-confirmation workflow to prevent premature closure from the driver end.
- This delivery OTP is sent to the client beforehand. To finalize the shipment, the driver must physically obtain this code from the client at the destination and submit it through the app.

## 💻 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/)

### Environment Variables

Create a `.env` file in the root of your server directory and add the following required variables:

```env
# Server
PORT=5000


# Database
MONGO_URI=your_mongodb_connection_string
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# External APIs
SMS_API_KEY=your_sms_provider_key
GEOCODING_API_KEY=your_geocoding_service_key
```

### Running Locally

**1. Clone the repository**

```bash
git clone https://github.com/w-2006-aksh/freight-management-web.git
cd freight-management-web
```

**2. Install Backend Dependencies & Start Server**

```bash
cd backend
npm install
npm run dev
```

**3. Install Frontend Dependencies & Start Client**

```bash
cd frontend
npm install
npm run dev
```
