const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

jest.mock('../services/userService');
const usersvc = require('../services/userService');

// Helper to generate a real valid token for protected routes
const generateToken = () => {
    return jwt.sign(
        { userId: '123', email: 'test@example.com' },
        config.jwtSecret,
        { expiresIn: '1h' }
    );
};

describe('GET /api/users/profile', () => {
    it('should return user profile with valid token', async () => {
        usersvc.getUserById.mockResolvedValue({
            id: '123',
            email: 'test@example.com'
        });

        const res = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${generateToken()}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe('test@example.com');
    });

    it('should return 401 with no token', async () => {
        const res = await request(app)
            .get('/api/users/profile');

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('No token provided');
    });

    it('should return 401 with invalid token', async () => {
        const res = await request(app)
            .get('/api/users/profile')
            .set('Authorization', 'Bearer invalidtoken');

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Invalid or expired token');
    });
});

describe('PATCH /api/users/profile', () => {
    it('should update profile with valid token', async () => {
        usersvc.updateUser.mockResolvedValue({
            id: '123',
            email: 'test@example.com',
            username: 'newusername'
        });

        const res = await request(app)
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${generateToken()}`)
            .send({ username: 'newusername' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.username).toBe('newusername');
    });

    it('should return 401 with no token', async () => {
        const res = await request(app)
            .patch('/api/users/profile')
            .send({ username: 'newusername' });

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('No token provided');
    });
});