# 🍅 Pomodoro Timer Web App — DevOps & MLOps Assignment

**Submitted by:** Geetanjali Vishwakarma (0201AI233D03)
**Semester:** 8th Sem
**Department:** Artificial Intelligence and Data Science
**Submitted to:** Prof. Praveen Patel

---

## Assignment Brief

This project demonstrates containerisation and CI/CD automation of a full-stack web application.

**Tasks completed:**
- Dockerized the full-stack application (frontend + backend + database)
- Pushed source code to GitHub
- Configured GitHub Actions pipeline:
  - On every push → run tests
  - Build Docker image
  - Deploy locally using Docker Compose

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB |
| DevOps | Docker, Docker Compose, GitHub Actions |

---

## Features

- Pomodoro Timer with focus and break sessions
- Custom focus time (15 / 25 / 45 min) and break time (5 / 10 / 15 min)
- Auto-switching between focus and break cycles
- Task-based session tracking
- Analytics dashboard with session history
- Responsive UI

---

## Run with Docker

```bash
git clone https://github.com/thegeetanjali/Pomodoro-timer.git
cd Pomodoro-timer
docker compose up --build
```

Open in browser: `http://localhost`

---

## Run without Docker

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend:**
```bash
# from project root
npm install
npm start
```

> Requires MongoDB running locally and Node.js 20+.

---

## Testing

**Frontend tests** (timer logic + component flow):
```bash
npm test
```

**Backend tests** (API endpoints):
```bash
cd backend
npm test
```

Tests cover: timer hook, register, login, session creation, and health check.

---

## CI/CD Pipeline

Pipeline file: `.github/workflows/ci.yml`

**Step 1 — Run Tests**
- Spins up a MongoDB service container
- Runs frontend and backend tests in parallel

**Step 2 — Build Docker Image**
- Builds multi-stage Docker images for frontend and backend
- Pushes images to Docker Hub with `latest` and commit SHA tags

**Step 3 — Deploy**
- SSHs into the server
- Pulls latest images and runs `docker compose up -d`

---

## Project Structure

```
pomodoro-timer/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   └── App.js
├── public/
├── .github/
│   └── workflows/
│       └── ci.yml
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── package.json
```

---

## Outcome

- Built and deployed a full-stack web application end-to-end
- Containerised all three services using Docker and Docker Compose
- Automated testing, building, and deployment via GitHub Actions CI/CD pipeline

---

## Author

**Geetanjali Vishwakarma**
B.Tech — Artificial Intelligence and Data Science
GitHub: [thegeetanjali](https://github.com/thegeetanjali)
