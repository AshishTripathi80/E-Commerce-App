import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import app from '../index';
import User from '../model/user';

describe('Authentication Endpoints', () => {
    const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'user'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should not register user with existing email', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send(testUser);

            // Second registration with same email
            const res = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create a test user before each login test
            await request(app)
                .post('/api/auth/register')
                .send(testUser);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });

        it('should not login with non-existent email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: testUser.password
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });

        it('should not login with missing credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Please provide email and password');
        });
    });
}); 