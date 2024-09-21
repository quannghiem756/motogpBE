
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Path to your Express app
const Calendar = require('../models/Calendar');

describe('Calendar API', () => {
    

    afterAll(async () => {
        // Clean up and disconnect
        // await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });

    let eventId;

    test('POST /calendar should create a new MotoGP event', async () => {
        const newEvent = {
            sponsored_name: 'Sponsored Qatar GP',
            date_end: '2024-03-12',
            date_start: '2024-03-10',
            name: 'MotoGP Qatar Grand Prix',
            season_id: 'season-2024',
            year: 2024,
            circuit_name: 'Losail International Circuit',
            country_name: 'Qatar'
        };

        const response = await request(app)
            .post('/calendar')
            .send(newEvent);

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newEvent.name);
        expect(response.body.sponsored_name).toBe(newEvent.sponsored_name);
        expect(response.body.year).toBe(newEvent.year);
        expect(response.body.circuit_name).toBe(newEvent.circuit_name);
        expect(response.body.country_name).toBe(newEvent.country_name);

        eventId = response.body.id;
    });

    test('GET /calendar should retrieve all MotoGP events', async () => {
        const response = await request(app).get('/calendar');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /calendar/:id should retrieve a MotoGP event by ID', async () => {
        const response = await request(app).get(`/calendar/${eventId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(eventId);
        expect(response.body.sponsored_name).toBe('Sponsored Qatar GP');
    });

    test('PUT /calendar/:id should update a MotoGP event by ID', async () => {
        const updatedData = {
            sponsored_name: 'Updated Sponsored Qatar GP',
            date_end: '2024-03-13',
            date_start: '2024-03-11',
            name: 'Updated MotoGP Qatar Grand Prix',
            season_id: 'season-2024',
            year: 2024,
            circuit_name: 'Updated Losail International Circuit',
            country_name: 'Qatar'
        };

        const response = await request(app)
            .put(`/calendar/${eventId}`)
            .send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updatedData.name);
        expect(response.body.sponsored_name).toBe(updatedData.sponsored_name);
        expect(response.body.circuit_name).toBe(updatedData.circuit_name);
    });

    // test('DELETE /calendar/:id should delete a MotoGP event by ID', async () => {
    //     const response = await request(app).delete(`/calendar/${eventId}`);
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body.message).toBe('Event deleted');

    //     const deletedEvent = await Calendar.findOne({ id: eventId });
    //     expect(deletedEvent).toBeNull();
    // });

    test('GET /calendar/:id with non-existent ID should return 404', async () => {
        const response = await request(app).get('/calendar/nonExistentId');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe('Event not found');
    });
});

