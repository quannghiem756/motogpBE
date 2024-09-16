
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Path to your Express app
const Rider = require('../models/Rider');

describe('Rider API', () => {
    afterAll(async () => {
        // Clean up and disconnect
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    let riderId;

    test('POST /riders should create a new rider', async () => {
        const newRider = {
            name: 'John Doe',
            team: 'Team A',
            championships: 2,
            raceWins: 10,
            podiums: 20,
            totalPoints: 50,
            dateOfBirth: '1995-01-01',
            nationality: 'USA',
            active: true,
            imageUrl: 'https://example.com/rider1.jpg',
            story: 'John Doe is a professional motorcycle racer.'
        };

        const response = await request(app)
            .post('/riders')
            .send(newRider);

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newRider.name);
        expect(response.body.team).toBe(newRider.team);
        expect(response.body.championships).toBe(newRider.championships);
        expect(response.body.raceWins).toBe(newRider.raceWins);
        expect(response.body.podiums).toBe(newRider.podiums);
        expect(response.body.totalPoints).toBe(newRider.totalPoints);

        riderId = response.body.id;
    });

    test('GET /riders should retrieve all riders', async () => {
        const response = await request(app).get('/riders');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /riders/:id should retrieve a rider by ID', async () => {
        const response = await request(app).get(`/riders/${riderId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(riderId);
        expect(response.body.name).toBe('John Doe');
    });

    test('PUT /riders/:id should update a rider by ID', async () => {
        const updatedRider = {
            name: 'Jane Doe',
            team: 'Team B',
            championships: 0,
            raceWins: 0,
            podiums: 0,
            totalPoints: 0,
            dateOfBirth: '1995-01-01',
            nationality: 'USA',
            active: true,
            imageUrl: 'https://example.com/rider2.jpg',
            story: 'Jane Doe is a professional motorcycle racer.'
        };

        const response = await request(app)
            .put(`/riders/${riderId}`)
            .send(updatedRider);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updatedRider.name);
        expect(response.body.team).toBe(updatedRider.team);
        expect(response.body.championships).toBe(updatedRider.championships);
        expect(response.body.raceWins).toBe(updatedRider.raceWins);
        expect(response.body.podiums).toBe(updatedRider.podiums);
        expect(response.body.totalPoints).toBe(updatedRider.totalPoints);
    });

    test('DELETE /riders/:id should delete a rider by ID', async () => {
        const response = await request(app).delete(`/riders/${riderId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Rider deleted');

        const deletedRider = await Rider.findOne({ id: riderId });
        expect(deletedRider).toBeNull();
    });

    test('GET /riders/:id with non-existent ID should return 404', async () => {
        const response = await request(app).get('/riders/nonExistentId');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Rider not found');
    });
});

