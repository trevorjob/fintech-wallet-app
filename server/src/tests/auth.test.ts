// src/tests/auth.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../app";
import { User } from "../models/user.model";
import { connectDB } from "../config/database";

const app = createApp();

describe("Auth API", () => {
  // Connect to test database before all tests
  beforeAll(async () => {
    await connectDB(true);
  });

  // Clean up test database after each test
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Disconnect from database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user and create a wallet", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.data.user).toHaveProperty("email", userData.email);
      expect(response.body.data.user).toHaveProperty(
        "firstName",
        userData.firstName
      );
      expect(response.body.data).toHaveProperty("token");

      // Password should not be returned
      expect(response.body.data.user).not.toHaveProperty("password");
    });

    it("should return error if email already exists", async () => {
      const userData = {
        email: "duplicate@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      };

      // First registration
      await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User with this email already exists");
    });

    it("should return validation error if data is invalid", async () => {
      const invalidUserData = {
        email: "invalid-email",
        password: "pw", // Too short
        firstName: "",
        lastName: "User",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toHaveLength(3); // 3 validation errors
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login a registered user", async () => {
      // Register a user first
      const userData = {
        email: "login@example.com",
        password: "password123",
        firstName: "Login",
        lastName: "Test",
      };

      await request(app).post("/api/v1/auth/register").send(userData);

      // Login with registered user
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.data.user).toHaveProperty("email", userData.email);
      expect(response.body.data).toHaveProperty("token");
    });

    it("should return error on invalid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });
});
