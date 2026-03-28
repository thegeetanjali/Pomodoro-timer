<div align="center">

# 🍅 Pomodoro Timer — DevOps Project

### B.Tech Final Year Assignment | DevOps & Cloud Computing

**Submitted by:** Geetanjali Vishwakarma
**Enrollment No:** 0201AI233D03
**Branch:** Artificial Intelligence & Data Science
**Subject:** DevOps & Cloud Computing Lab

---

[![CI/CD Pipeline](https://github.com/thegeetanjali/Pomodoro-timer/actions/workflows/ci.yml/badge.svg)](https://github.com/thegeetanjali/Pomodoro-timer/actions/workflows/ci.yml)
[![Docker Frontend](https://img.shields.io/badge/docker-frontend-2496ED?logo=docker&logoColor=white)](https://hub.docker.com)
[![Docker Backend](https://img.shields.io/badge/docker-backend-2496ED?logo=docker&logoColor=white)](https://hub.docker.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📋 Assignment Brief

This project demonstrates the end-to-end implementation of a **production-ready full-stack web application** using modern DevOps practices. Starting from a simple frontend-only Pomodoro timer, the application has been progressively upgraded to include:

- A **REST API backend** with authentication and data persistence
- **Containerisation** using multi-stage Docker builds
- **Orchestration** using Docker Compose (3-service stack)
- A complete **CI/CD pipeline** using GitHub Actions
- **Cloud deployment** on AWS EC2

The project follows industry-standard practices for code organisation, security, testing, and automated delivery.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⏱ **Pomodoro Timer** | Configurable focus (1–90 min) and break (1–30 min) sessions |
| 🔄 **Auto Cycle** | Automatic focus → break → focus transitions with long break every 4 sessions |
| 📌 **Task Labelling** | Name each session before starting |
| 🎯 **Preset Controls** | Quick-select buttons: 15 / 25 / 45 min focus, 5 / 10 / 15 min break |
| 📊 **Analytics Dashboard** | Daily goal progress, 7-day bar chart, lifetime stats |
| 💾 **Session Persistence** | Sessions stored in MongoDB (or localStorage fallback) |
| 🔔 **Notifications** | Browser tab title updates + toast notifications on completion |
| 🎨 **Smooth Animations** | Framer Motion screen transitions + SVG circular progress ring |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop |
| 🐳 **Fully Containerised** | One command to run the entire stack |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework (functional components + hooks) |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11 | Animations and screen transitions |
| Recharts | 2.12 | Analytics bar charts |
| React Router | 6 | Client-side routing |
| Axios | 1.6 | HTTP client with JWT interceptors |
| react-hot-toast | 2.4 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | JavaScript runtime |
| Express.js | 4.18 | REST API framework |
| MongoDB | 7 | NoSQL database for session storage |
| Mongoose | 8.2 | MongoDB ODM with schema validation |
| JSON Web Token | 9 | Stateless authentication |
| bcryptjs | 2.4 | Password hashing (12 salt rounds) |
| Helmet | 7 | HTTP security headers |
| express-rate-limit | 7 | API rate limiting (100 req/15 min) |
| Morgan | 1.10 | HTTP request logging |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerisation (multi-stage builds) |
| Docker Compose | Multi-container orchestration |
| Nginx | Static file serving + reverse proxy |
| GitHub Actions | CI/CD pipeline automation |
| AWS EC2 | Cloud deployment target |
| Docker Hub | Container image registry |

### Testing
| Tool | Scope |
|---|---|
| Jest | Unit tests (timer logic, utilities) |
| React Testing Library | Component and hook tests |
| Supertest | API integration tests |

---

## 🏗 Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                    React SPA (Port 3000/80)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NGINX (Port 80)                             │
│   • Serves static React build                                   │
│   • Proxies /api/* → backend:5000                               │
│   • Gzip compression + static asset caching                     │
└──────────────┬──────────────────────────────────────────────────┘
               │ /api/*
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXPRESS API (Port 5000)                        │
│                                                                 │
│   POST /api/auth/register    POST /api/auth/login               │
│   GET  /api/auth/me          PATCH /api/auth/me                 │
│   GET  /api/sessions         POST  /api/sessions                │
│   DELETE /api/sessions/:id   GET   /api/analytics/summary       │
│   GET  /api/health                                              │
│                                                                 │
│   Middleware: Helmet → CORS → Rate Limit → JWT Auth             │
└──────────────┬──────────────────────────────────────────────────┘
               │ Mongoose ODM
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MONGODB (Port 27017)                          │
│                                                                 │
│   Collections:  users  │  sessions                             │
│   Volume:       mongo_data (persistent)                         │
└─────────────────────────────────────────────────────────────────┘
```

### Docker Network Topology

```
                    pomodoro_net (bridge)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐
   │  frontend   │  │   backend   │  │    mongo    │
   │  :80        │  │  :5000      │  │  :27017     │
   │  nginx      │  │  express    │  │  mongodb    │
   └─────────────┘  └─────────────┘  └─────────────┘
         ▲
         │ exposed to host
       :80
```

---

## 📁 Folder Structure

```
pomodoro-timer/
│
├── 📁 .github/
│   └── workflows/
│       └── ci.yml                  # Full CI/CD pipeline (4 jobs)
│
├── 📁 backend/                     # Node.js / Express API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # register, login, getMe, updateMe
│   │   │   ├── session.controller.js   # CRUD + pomodoroNumber tracking
│   │   │   └── analytics.controller.js # MongoDB aggregation pipelines
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js      # JWT protect middleware
│   │   │   └── error.middleware.js     # Global error handler
│   │   ├── models/
│   │   │   ├── User.model.js           # bcrypt pre-save hook
│   │   │   └── Session.model.js        # Compound index on (user, startedAt)
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── session.routes.js
│   │   │   └── analytics.routes.js
│   │   ├── utils/
│   │   │   ├── db.js                   # Mongoose connect with exit-on-fail
│   │   │   └── jwt.js                  # signToken / verifyToken
│   │   └── server.js                   # Express app entry point
│   ├── tests/
│   │   └── api.test.js                 # Supertest integration tests (8 cases)
│   ├── .env.example                    # Environment variable template
│   ├── Dockerfile                      # Multi-stage Node.js image
│   └── package.json
│
├── 📁 src/                         # React frontend
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx              # Timer / Dashboard nav
│   │   ├── ui/
│   │   │   ├── Button.jsx              # Loading state, 3 variants
│   │   │   └── Input.jsx               # Label + error message
│   │   └── Card.jsx                    # Framer Motion animated wrapper
│   ├── context/
│   │   └── AuthContext.jsx             # Global auth state (if auth enabled)
│   ├── hooks/
│   │   └── useTimer.js                 # All timer logic (custom durations)
│   ├── pages/
│   │   ├── TimerPage.jsx               # Main timer (idle/running/end states)
│   │   └── DashboardPage.jsx           # Analytics with Recharts
│   ├── services/
│   │   └── api.js                      # Axios instance + JWT interceptor
│   ├── App.js                          # Router + route definitions
│   └── index.js                        # React DOM entry point
│
├── 📁 public/
│   ├── index.html
│   └── favicon.svg                 # Custom SVG tomato favicon
│
├── Dockerfile                      # Frontend: Node build → Nginx serve
├── docker-compose.yml              # Production: frontend + backend + mongo
├── docker-compose.dev.yml          # Dev overrides: hot reload + exposed ports
├── nginx.conf                      # SPA fallback + /api proxy + gzip
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Bundled with Node |
| Docker Desktop | Latest | [docker.com](https://docker.com) |
| Git | Any | [git-scm.com](https://git-scm.com) |

---

### Option A — Run with Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/thegeetanjali/Pomodoro-timer.git
cd Pomodoro-timer

# 2. Start the full stack (frontend + backend + MongoDB)
docker compose up --build

# 3. Open in browser
#    http://localhost
```

> The first build takes ~2 minutes. Subsequent starts use Docker layer cache and are instant.

**Stop the stack:**
```bash
docker compose down          # stop containers
docker compose down -v       # stop + delete MongoDB data volume
```

---

### Option B — Run Without Docker (Local Dev)

**Terminal 1 — Backend:**
```bash
cd backend
cp .env.example .env         # copy environment template

# Edit .env and set:
#   MONGO_URI=mongodb://localhost:27017/pomodoro
#   JWT_SECRET=any_long_random_string

npm install
npm run dev                  # starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
# from project root
npm install
npm start                    # starts on http://localhost:3000
```

> Make sure MongoDB is running locally (`mongod` or MongoDB Compass).

---

### Environment Variables

**Backend (`backend/.env`):**

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/pomodoro
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend (`.env.local`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🧪 Test Instructions

### Run All Tests

```bash
# Frontend tests (Jest + React Testing Library)
npm test

# Backend tests (Jest + Supertest)
cd backend && npm test
```

### Frontend Test Coverage

```
src/App.test.js
├── formatTime()
│   ├── ✅ formats 0 as 00:00
│   ├── ✅ formats 90 as 01:30
│   ├── ✅ formats 1500 as 25:00
│   └── ✅ formats 300 as 05:00
│
└── useTimer hook
    ├── ✅ initialises with focus type and 25:00
    ├── ✅ starts counting down after start()
    ├── ✅ calls onSessionEnd with completed=false on stop()
    ├── ✅ resets to initial state after reset()
    └── ✅ switches to short_break after nextCycle()
```

### Backend Test Coverage

```
backend/tests/api.test.js
├── POST /api/auth/register
│   ├── ✅ creates user and returns JWT token
│   ├── ✅ rejects duplicate email with 409
│   └── ✅ rejects short password with 400
│
├── POST /api/auth/login
│   ├── ✅ returns token on valid credentials
│   └── ✅ rejects wrong password with 401
│
├── GET /api/auth/me
│   ├── ✅ returns user profile with valid token
│   └── ✅ returns 401 without token
│
├── POST /api/sessions
│   └── ✅ creates session and assigns pomodoroNumber
│
├── GET /api/sessions
│   └── ✅ returns paginated session list
│
└── GET /api/health
    └── ✅ returns { status: "ok" }
```

---

## ⚙️ CI/CD Pipeline

### Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Event: push / pull_request → main                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
┌──────────────────────┐       ┌──────────────────────┐
│  Job 1               │       │  Job 2               │
│  backend-test        │       │  frontend-test       │
│                      │       │                      │
│  • Spin up MongoDB   │       │  • npm ci            │
│    service container │       │  • npm test          │
│  • npm ci            │       │  • npm run build     │
│  • npm test          │       │  • Upload artifact   │
│    (supertest)       │       │    (build/)          │
└──────────┬───────────┘       └──────────┬───────────┘
           │                               │
           └───────────────┬───────────────┘
                           │ both pass + push to main
                           ▼
              ┌────────────────────────┐
              │  Job 3                 │
              │  docker-publish        │
              │                        │
              │  • Docker Buildx setup │
              │  • Login to Docker Hub │
              │  • Build + push        │
              │    frontend:latest     │
              │    frontend:<sha>      │
              │  • Build + push        │
              │    backend:latest      │
              │    backend:<sha>       │
              └────────────┬───────────┘
                           │ success + main branch
                           ▼
              ┌────────────────────────┐
              │  Job 4                 │
              │  deploy (EC2)          │
              │  [manual approval]     │
              │                        │
              │  • SCP compose file    │
              │  • SSH → EC2           │
              │  • docker compose pull │
              │  • docker compose up   │
              │  • docker image prune  │
              └────────────────────────┘
```

### GitHub Secrets Required

| Secret Name | Description |
|---|---|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username |
| `DOCKER_HUB_TOKEN` | Docker Hub access token (not password) |
| `EC2_HOST` | EC2 public IP address or domain |
| `EC2_USER` | SSH username (e.g. `ubuntu`) |
| `EC2_SSH_KEY` | Full content of your `.pem` private key |
| `JWT_SECRET` | Production JWT signing secret (32+ chars) |

### Pipeline File Location
```
.github/workflows/ci.yml
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | `{ name, email, password }` | `{ token, user }` |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | `{ token, user }` |
| `GET` | `/api/auth/me` | ✅ JWT | — | `{ user }` |
| `PATCH` | `/api/auth/me` | ✅ JWT | `{ name, dailyGoal }` | `{ user }` |

### Sessions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/sessions` | ✅ JWT | Save a completed/stopped session |
| `GET` | `/api/sessions` | ✅ JWT | List sessions (paginated, filterable by date) |
| `DELETE` | `/api/sessions/:id` | ✅ JWT | Delete a session |

### Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/analytics/summary` | ✅ JWT | Today stats + 7-day chart + lifetime totals |

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | ❌ | Service health check |

---

## 🐳 Docker Details

### Multi-Stage Build Strategy

**Frontend (`Dockerfile`):**
```
Stage 1 — builder (node:20-alpine)
  └── npm ci → npm run build → /app/build

Stage 2 — production (nginx:1.25-alpine)
  └── COPY /app/build → /usr/share/nginx/html
  └── Final image size: ~25 MB
```

**Backend (`backend/Dockerfile`):**
```
Stage 1 — deps (node:20-alpine)
  └── npm ci --omit=dev (production deps only)

Stage 2 — production (node:20-alpine)
  └── Non-root user (appuser)
  └── COPY node_modules + src only
  └── Final image size: ~180 MB
```

### Docker Compose Services

```yaml
Services:
  mongo     → mongo:7-jammy     (healthcheck: mongosh ping)
  backend   → custom image      (depends_on: mongo healthy)
  frontend  → custom image      (depends_on: backend healthy)

Volumes:
  mongo_data → /data/db         (persistent across restarts)

Network:
  pomodoro_net (bridge)         (internal service discovery)

Exposed:
  frontend:80 → host:80         (only public port)
```

---

## ☁️ Deployment

### AWS EC2 Setup

```bash
# 1. Launch EC2 instance
#    AMI: Ubuntu 22.04 LTS
#    Type: t2.micro (free tier)
#    Security Group: open ports 22, 80, 443

# 2. SSH into instance
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# 3. Install Docker
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker ubuntu
newgrp docker

# 4. CI/CD handles all subsequent deployments automatically
#    on every push to main branch
```

### Deployment Links

| Service | URL |
|---|---|
| 🌐 Frontend (EC2) | `http://<EC2_PUBLIC_IP>` *(configure after deployment)* |
| 🔧 Backend API | `http://<EC2_PUBLIC_IP>/api` *(configure after deployment)* |
| 🐳 Docker Hub Frontend | `docker pull <username>/pomodoro-frontend` |
| 🐳 Docker Hub Backend | `docker pull <username>/pomodoro-backend` |

---

## 🔮 Future Improvements

| Priority | Feature | Complexity |
|---|---|---|
| 🔴 High | PWA support — install as mobile app + offline mode | Medium |
| 🔴 High | Kubernetes deployment with Helm chart | High |
| 🟡 Medium | Terraform IaC for EC2 + VPC provisioning | High |
| 🟡 Medium | Prometheus + Grafana monitoring dashboard | Medium |
| 🟡 Medium | WebSocket real-time sync across browser tabs | Medium |
| 🟢 Low | Dark mode toggle | Low |
| 🟢 Low | Email notifications for daily goal completion | Medium |
| 🟢 Low | Team/shared focus rooms | High |
| 🟢 Low | Spotify integration for focus music | Medium |

---

## 📚 Key DevOps Concepts Demonstrated

| Concept | Implementation |
|---|---|
| **Containerisation** | Multi-stage Docker builds for both frontend and backend |
| **Orchestration** | Docker Compose with health checks and dependency ordering |
| **Reverse Proxy** | Nginx proxying `/api/*` to Express, serving SPA with fallback |
| **CI/CD Automation** | 4-job GitHub Actions pipeline with parallel test execution |
| **Image Registry** | Docker Hub push with `latest` + commit SHA tags |
| **Secret Management** | GitHub Secrets for credentials, never hardcoded |
| **Infrastructure** | AWS EC2 deployment via SSH in CI pipeline |
| **Security** | Helmet headers, rate limiting, JWT auth, bcrypt hashing, non-root container user |
| **Observability** | Morgan HTTP logging, health check endpoint, structured error responses |
| **Testing** | Unit tests (hooks), integration tests (API with real DB), CI test gates |

---

## 👩‍💻 Author

**Geetanjali Vishwakarma**
Enrollment: `0201AI233D03`
Branch: AI & Data Science

[![GitHub](https://img.shields.io/badge/GitHub-thegeetanjali-181717?logo=github)](https://github.com/thegeetanjali)

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute for educational purposes.

---

<div align="center">
Made with 🍅 and ☕ | B.Tech Final Year DevOps Project
</div>
