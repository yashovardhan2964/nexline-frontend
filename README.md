⚡ NexLine Frontend

> React-based customer portal and admin dashboard for the NexLine queue management platform.

![React](https://img.shields.io/badge/React-18-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

---

📌 What This Does

Two interfaces in one React app:

**Customer Portal** (`/`)
- Select service type (Billing, Consultation, Pharmacy)
- Enter name and phone number
- Get a digital token with AI-predicted wait time
- Live queue position updates via WebSocket — no page refresh needed

**Admin Dashboard** (`/admin`)
- JWT-based login for ADMIN/STAFF accounts
- Counter management — view active counters and service assignments
- Call next token with one click
- Complete or skip tokens
- Real-time status updates

---

🚀 Setup

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:3000` for customer portal
Visit `http://localhost:3000/admin` for admin dashboard

**Requires** the NexLine backend running on `localhost:8080`
and the AI service running on `localhost:8000`.

**Default admin credentials:**
- Phone: `9999999999`
- Password: `admin123`

---

🛠️ Tech Stack

| Library | Purpose |
|---------|---------|
| React 18 | UI framework |
| React Router | Page routing |
| Axios | HTTP client (with JWT interceptor) |
| STOMP.js | WebSocket client |
| SockJS | WebSocket fallback |

---

📁 Structure

src/
├── api/
│ └── api.js # All API calls + JWT interceptor
├── pages/
│ ├── CustomerPage.js # Token generation + live status
│ └── AdminPage.js # Login + counter management
├── components/
│ ├── TokenCard.js # Token display card
│ ├── QueueStatus.js # Live queue position (WebSocket)
│ └── CounterPanel.js # Admin counter controls
└── App.js # Router setup

---

🔗 Part of NexLine

| Repo | Description |
|------|-------------|
| [nexline-backend](https://github.com/yashovardhan2964/nexline-backend) | Spring Boot core backend |
| [nexline-ai](https://github.com/yashovardhan2964/nexline-ai) | Python FastAPI ML microservice |
| **nexline-frontend** | This repo — React UI |
