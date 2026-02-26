const request = require('supertest');
const app = require('../app');

// Mock the entire userService so we never hit Supabase
jest.mock('../services/userService');
const usersvc = require('../services/userService');

describe('POST /api/users/register', () => {
    it('should register a user successfully', async () => {
        // Tell the mock what to return
        usersvc.registerUser.mockResolvedValue({
            id: '123',
            email: 'test@example.com'
        });

        const res = await request(app)
            .post('/api/users/register')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 400 if registration fails', async () => {
        // Tell the mock to throw an error
        usersvc.registerUser.mockRejectedValue(new Error('Email already exists'));

        const res = await request(app)
            .post('/api/users/register')
            .send({ email: 'existing@example.com', password: 'password123' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Email already exists');
    });
});

describe('POST /api/users/login', () => {
    it('should login successfully and return a token', async () => {
        usersvc.loginUser.mockResolvedValue({
            token: 'fake-jwt-token',
            user: { id: '123', email: 'test@example.com' }
        });

        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should return 400 with invalid credentials', async () => {
        usersvc.loginUser.mockRejectedValue(new Error('Invalid credentials'));

        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Invalid credentials');
    });
});