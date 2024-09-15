const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Path to your Express app
const Rider = require('../models/Rider');

describe('Rider Controller', () => {
    afterAll(async () => {
        // Clean up and disconnect
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    let rider;

    beforeEach(async () => {
        await Rider.deleteMany({});
        rider = new Rider({
            id: '1',
            name: 'John Doe',
            team: 'Team A',
            championships: 2,
            raceWins: 10,
            podiums: 20,
            totalPoints: 50,
            dateOfBirth: new Date('1990-01-01'),
            nationality: 'USA',
            active: true,
            imageUrl: 'https://example.com/rider1.jpg',
            story: 'John Doe is a professional motorcycle racer.'
        });
        await rider.save();
    });

    afterEach(async () => {
        await Rider.deleteMany({});
    });

    describe('POST /riders', () => {
        it('should create a new rider', async () => {
            const response = await request(app)
                .post('/riders')
                .send({
                    name: 'Jane Doe',
                    team: 'Team B',
                    championships: 0,
                    raceWins: 0,
                    podiums: 0,
                    totalPoints: 0,
                    dateOfBirth: new Date('1995-01-01'),
                    nationality: 'USA',
                    active: true,
                    imageUrl: 'https://example.com/rider2.jpg',
                    story: 'Jane Doe is a professional motorcycle racer.'
                })
                .expect(201);

            expect(response.body).toEqual({
                id: expect.any(String),
                name: 'Jane Doe',
                team: 'Team B',
                championships: 0,
                raceWins: 0,
                podiums: 0,
                totalPoints: 0,
                dateOfBirth: expect.any(Date),
                nationality: 'USA',
                active: true,
                imageUrl: 'https://example.com/rider2.jpg',
                story: 'Jane Doe is a professional motorcycle racer.',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });

        it('should return 400 if the request body is invalid', async () => {
            const response = await request(app)
                .post('/riders')
                .send({})
                .expect(400);

            expect(response.body).toEqual({
                message: 'Rider validation failed: name: Path `name` is required., team: Path `team` is required., championships: Path `championships` is required., raceWins: Path `raceWins` is required., podiums: Path `podiums` is required., totalPoints: Path `totalPoints` is required., dateOfBirth: Path `dateOfBirth` is required., nationality: Path `nationality` is required., active: Path `active` is required., imageUrl: Path `imageUrl` is required., story: Path `story` is required.'
            });
        });
    });

    describe('GET /riders', () => {
        it('should get all riders', async () => {
            const response = await request(app)
                .get('/riders')
                .expect(200);

            expect(response.body).toEqual([
                {
                    id: '1',
                    name: 'John Doe',
                    team: 'Team A',
                    championships: 2,
                    raceWins: 10,
                    podiums: 20,
                    totalPoints: 50,
                    dateOfBirth: expect.any(Date),
                    nationality: 'USA',
                    active: true,
                    imageUrl: 'https://example.com/rider1.jpg',
                    story: 'John Doe is a professional motorcycle racer.',
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }
            ]);
        });

        it('should return 404 if there are no riders', async () => {
            await Rider.deleteMany({});
            const response = await request(app)
                .get('/riders')
                .expect(404);

            expect(response.body).toEqual({
                message: 'No riders found.'
            });
        });
    });

    describe('GET /riders/:id', () => {
        it('should get a rider by ID', async () => {
            const response = await request(app)
                .get('/riders/1')
                .expect(200);

            expect(response.body).toEqual({
                id: '1',
                name: 'John Doe',
                team: 'Team A',
                championships: 2,
                raceWins: 10,
                podiums: 20,
                totalPoints: 50,
                dateOfBirth: expect.any(Date),
                nationality: 'USA',
                active: true,
                imageUrl: 'https://example.com/rider1.jpg',
                story: 'John Doe is a professional motorcycle racer.',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });

        it('should return 404 if the rider does not exist', async () => {
            const response = await request(app)
                .get('/riders/1234567890')
                .expect(404);

            expect(response.body).toEqual({
                message: 'Rider not found.'
            });
        });
    });

    describe('DELETE /riders/:id', () => {
        it('should delete a rider by ID', async () => {
            const response = await request(app)
                .delete('/riders/1')
                .expect(200);

            expect(response.body).toEqual({
                message: 'Rider deleted.'
            });

            const rider = await Rider.findById('1');
            expect(rider).toBeNull();
        });

        it('should return 404 if the rider does not exist', async () => {
            const response = await request(app)
                .delete('/riders/1234567890')
                .expect(404);

            expect(response.body).toEqual({
                message: 'Rider not found.'
            });
        });
    });

})
