# 🍅 Pomodoro DevOps App — Full-Stack Edition

> A production-ready, full-stack Pomodoro focus timer with user authentication, session tracking, analytics dashboard, and a complete DevOps pipeline — built as a B.Tech Final Year DevOps project.

[![CI/CD](https://github.com/<your-username>/pomodoro-devops-app/actions/workflows/ci.yml/badge.svg)](https://github.com/<your-username>/pomodoro-devops-app/actions)
[![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)](https://hub.docker.com/r/<your-username>/pomodoro-frontend)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | JWT-based register/login with bcrypt password hashing |
| ⏱ Pomodoro Timer | 25-min focus + 5/15-min break cycles with SVG progress ring |
| 📌 Task Input | Name your session before starting |
| 🔄 Auto Cycle | Automatically suggests break/focus after each session |
| 💾 Session History | Every session saved to MongoDB with duration and completion status |
| 📊 Analytics Dashboard | Daily goal progress, 7-day bar chart, lifetime stats |
| 🔔 Notifications | Browser tab title updates + toast notifications |
| 🐳 Docker | Multi-stage builds for frontend and backend |
| ⚙️ CI/CD | GitHub Actions → Docker Hub → AWS EC2 |

---

## 🛠 Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 18 (functional components + hooks) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP | Axios with JWT interceptors |
| Notifications | react-hot-toast |

### Backend
| | |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Security | Helmet, CORS, express-rate-limit |
| Validation | express-validator |

### DevOps
| | |
|---|---|
| Containers | Docker (multi-stage) |
| Orchestration | Docker Compose |
| Web Server | Nginx (SPA + reverse proxy) |
| CI/CD | GitHub Actions |
| Registry | Docker Hub |
| Cloud | AWS EC2 |

---

## 📁 Folder Structure

```
pomodoro-devops-app/
│
├── 📁 backend/                     # Express API
│   ├── src/
│   │   ├── controllers/            # Route handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── session.controller.js
│   │   │   └── analytics.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js  # JWT protect
│   │   │   └── error.middleware.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   └── Session.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── session.routes.js
│   │   │   └── analytics.routes.js
│   │   ├── utils/
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── jwt.js              # sign/verify helpers
│   │   └── server.js               # Express entry point
│   ├── tests/
│   │   └── api.test.js             # Supertest integration tests
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── 📁 src/                         # React frontend
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   └── Input.jsx
│   │   └── Card.jsx
│   ├── context/
│   │   └── AuthContext.jsx         # Global auth state
│   ├── hooks/
│   │   └── useTimer.js             # All timer logic
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── TimerPage.jsx           # Main timer screen
│   │   └── DashboardPage.jsx       # Analytics
│   ├── services/
│   │   └── api.js                  # Axios instance + all API calls
│   ├── App.js                      # Router + auth guards
│   ├── App.test.js
│   └── index.js
│
├── 📁 .github/workflows/
│   └── ci.yml                      # Full CI/CD pipeline
│
├── Dockerfile                      # Frontend multi-stage build
├── docker-compose.yml              # Production orchestration
├── docker-compose.dev.yml          # Development overrides
├── nginx.conf                      # Nginx: SPA + API proxy
└── README.md
```

---

## 🚀 Run Locally (Development)

### Prerequisites
- Node.js 20+, npm
- MongoDB running locally (`mongod`)

```bash
# 1. Clone
git clone https://github.com/<your-username>/pomodoro-devops-app.git
cd pomodoro-devops-app

# 2. Backend setup
cd backend
cp .env.example .env          # edit MONGO_URI and JWT_SECRET
npm install
npm run dev                   # starts on :5000

# 3. Frontend setup (new terminal)
cd ..
npm install
npm start                     # starts on :3000
```

---

## 🐳 Run with Docker Compose

```bash
# Production (single command)
JWT_SECRET=your_secret docker compose up --build

# App available at http://localhost
```

```bash
# Development (hot reload)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 🧪 Testing

```bash
# Frontend unit tests (timer hook + component flow)
npm test

# Backend API integration tests
cd backend && npm test
```

### What's tested

| Test Suite | Coverage |
|---|---|
| `formatTime()` | 4 unit tests — edge cases |
| `useTimer` hook | Start, stop, reset, cycle switch |
| `POST /api/auth/register` | Success, duplicate email, short password |
| `POST /api/auth/login` | Valid credentials, wrong password |
| `GET /api/auth/me` | With token, without token |
| `POST /api/sessions` | Creates session, assigns pomodoroNumber |
| `GET /api/sessions` | Returns paginated list |
| `GET /api/health` | Health check |

---

## ⚙️ CI/CD Pipeline

```
Push to main
     │
     ├─── Job 1: backend-test ──────────────────────────────────────
     │    ✔ Spin up MongoDB service container
     │    ✔ npm ci (backend)
     │    ✔ npm test (supertest against real MongoDB)
     │
     ├─── Job 2: frontend-test ─────────────────────────────────────
     │    ✔ npm ci (frontend)
     │    ✔ npm test (Jest + RTL)
     │    ✔ npm run build
     │    ✔ Upload build artifact
     │
     └─── Job 3: docker-publish (main only) ────────────────────────
          ✔ Login to Docker Hub
          ✔ Build & push frontend image  → :latest + :<sha>
          ✔ Build & push backend image   → :latest + :<sha>
               │
               └─── Job 4: deploy (main only, manual approval) ─────
                    ✔ SCP docker-compose.yml to EC2
                    ✔ SSH → docker compose pull + up -d
                    ✔ docker image prune
```

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username |
| `DOCKER_HUB_TOKEN` | Docker Hub access token |
| `EC2_HOST` | EC2 public IP or domain |
| `EC2_USER` | SSH user (e.g. `ubuntu`) |
| `EC2_SSH_KEY` | Private SSH key (PEM content) |
| `JWT_SECRET` | Production JWT secret |

---

## ☁️ AWS EC2 Deployment

```bash
# 1. Launch EC2 (Ubuntu 22.04, t2.micro for free tier)
# 2. Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

# 3. SSH into instance and install Docker
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker ubuntu

# 4. The GitHub Actions deploy job handles everything else automatically
#    on every push to main
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Get JWT token |
| GET | `/api/auth/me` | ✅ | Get current user |
| PATCH | `/api/auth/me` | ✅ | Update name/dailyGoal |

### Sessions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/sessions` | ✅ | Save a session |
| GET | `/api/sessions` | ✅ | List sessions (paginated) |
| DELETE | `/api/sessions/:id` | ✅ | Delete a session |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/summary` | ✅ | Today + weekly + lifetime stats |

---

## 📸 Screenshots

| Login | Timer | Dashboard |
|:---:|:---:|:---:|
| *(placeholder)* | *(placeholder)* | *(placeholder)* |

---

## 🔮 Future Improvements

- [ ] WebSocket real-time sync across browser tabs
- [ ] PWA support — install as mobile app + offline mode
- [ ] Email notifications for daily goal completion
- [ ] Kubernetes deployment with Helm chart
- [ ] Prometheus + Grafana monitoring
- [ ] Terraform IaC for EC2 provisioning
- [ ] Dark mode
- [ ] Team/shared focus rooms

---

## 📄 License

MIT
