const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server");

// ── Test DB setup ───────────────────────────────────────────────
beforeAll(async () => {
  // Use a separate test database
  const uri = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/pomodoro_test";
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clean collections between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ── Helpers ─────────────────────────────────────────────────────
const testUser = { name: "Test User", email: "test@example.com", password: "password123" };

const registerAndLogin = async () => {
  const res = await request(app).post("/api/auth/register").send(testUser);
  return res.body.token;
};

// ── Auth tests ──────────────────────────────────────────────────
describe("POST /api/auth/register", () => {
  it("creates a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("rejects duplicate email with 409", async () => {
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(409);
  });

  it("rejects short password with 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...testUser, password: "123" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(testUser);
  });

  it("returns token on valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("rejects wrong password with 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpass" });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns user profile with valid token", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});

// ── Session tests ───────────────────────────────────────────────
describe("POST /api/sessions", () => {
  it("creates a session for authenticated user", async () => {
    const token = await registerAndLogin();
    const payload = {
      task: "Write unit tests",
      type: "focus",
      plannedDuration: 1500,
      actualDuration: 1500,
      completed: true,
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
    };
    const res = await request(app)
      .post("/api/sessions")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.body.session.task).toBe("Write unit tests");
    expect(res.body.session.pomodoroNumber).toBe(1);
  });
});

describe("GET /api/sessions", () => {
  it("returns paginated sessions", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .get("/api/sessions")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("sessions");
    expect(Array.isArray(res.body.sessions)).toBe(true);
  });
});

// ── Health check ────────────────────────────────────────────────
describe("GET /api/health", () => {
  it("returns ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
