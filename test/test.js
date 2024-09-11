// calendarController.test.js
const request = require('supertest');
const express = require('express');
const Calendar = require('../models/Calendar');
const mongoose = require('mongoose');
const calendarController = require('../routes/calendarController');
const app = express();
app.use('/calendar', calendarController);
app.use(express.json());

mongoose.connect('mongodb+srv://quannghiem100:iAAimy99vLhoZuAH@cluster0.thfyy.mongodb.net/motogp?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});
afterAll(async () => {
  await mongoose.connection.close();
});


const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

describe('Calendar Controller', () => {
  
  // Create a new MotoGP event  
  describe('POST /calendar', () => {
    it('should create a new event', async () => {
      const event = {
        sponsored_name: 'Test Event',
        date_end: new Date('2023-03-01T00:00:00.000Z'),
        date_start: new Date('2023-02-28T00:00:00.000Z'),
        name: 'Test Event',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Test Circuit',
        country_name: 'Test Country',
      };

      const res = await request(app).post('/calendar').send(event);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.sponsored_name).toBe(event.sponsored_name);
      expect(res.body.date_end).toEqual(event.date_end.toISOString());
      expect(res.body.date_start).toEqual(event.date_start.toISOString());
      expect(res.body.name).toBe(event.name);
      expect(res.body.season_id).toBe(event.season_id);
      expect(res.body.year).toBe(event.year);
      expect(res.body.circuit_name).toBe(event.circuit_name);
      expect(res.body.country_name).toBe(event.country_name);
    });

    it('should return 400 if event is invalid', async () => {
      const event = {
        sponsored_name: '',
        date_end: new Date('2023-03-01T00:00:00.000Z'),
        date_start: new Date('2023-02-28T00:00:00.000Z'),
        name: 'Test Event',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Test Circuit',
        country_name: 'Test Country',
      };

      const res = await request(app).post('/calendar').send(event);

      expect(res.status).toBe(400);
    });
  });

  // Get all MotoGP events
  describe('GET /calendar', () => {
    it('should return all events', async () => {
      const event1 = new Calendar({
        sponsored_name: 'Test Event 1',
        date_end: new Date('2023-03-01T00:00:00.000Z'),
        date_start: new Date('2023-02-28T00:00:00.000Z'),
        name: 'Test Event 1',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Test Circuit 1',
        country_name: 'Test Country 1',
      });

      const event2 = new Calendar({
        sponsored_name: 'Test Event 2',
        date_end: new Date('2023-04-01T00:00:00.000Z'),
        date_start: new Date('2023-03-31T00:00:00.000Z'),
        name: 'Test Event 2',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Test Circuit 2',
        country_name: 'Test Country 2',
      });

      await event1.save();
      await event2.save();

      const res = await request(app).get('/calendar');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].sponsored_name).toBe(event1.sponsored_name);
      expect(res.body[1].sponsored_name).toBe(event2.sponsored_name);
    });
  });

  // Get a single MotoGP event by ID
  describe('GET /calendar/:id', () => {
    it('should return a single event', async () => {
      const event = new Calendar({
        sponsored_name: 'Test Event',
        date_end: new Date('2023-03-01T00:00:00.000Z'),
        date_start: new Date('2023-02-28T00:00:00.000Z'),
        name: 'Test Event',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Test Circuit',
        country_name: 'Test Country',
      });

      await event.save();

      const res = await request(app).get(`/calendar/${event.id}`);

      expect(res.status).toBe(200);
      expect(res.body.sponsored_name).toBe(event.sponsored_name);
      expect(res.body.date_end).toEqual(event.date_end.toISOString());
      expect(res.body.date_start).toEqual(event.date_start.toISOString());
      expect(res.body.name).toBe(event.name);
      expect(res.body.season_id).toBe(event.season_id);
      expect(res.body.year).toBe(event.year);
      expect(res.body.circuit_name).toBe(event.circuit_name);
      expect(res.body.country_name).toBe(event.country_name);
    });

    it('should return 404 if event is not found', async () => {
      const res = await request(app).get('/calendar/1234567890');

      expect(res.status).toBe(404);
    });
  });

  // Update a MotoGP event by ID
  describe('PUT /calendar/:id', () => {
    it('should update a single event', async () => {
      const event = new Calendar({
        sponsored_name: 'Test Event',
        date_end: new Date('2023-03-01T00:00:00.000Z'),
        date_start: new Date('2023-02-28T00:00:00.000Z'),
        name: 'Test Event',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Test Circuit',
        country_name: 'Test Country',
      });

      await event.save();

      const updatedEvent = {
        sponsored_name: 'Updated Test Event',
        date_end: new Date('2023-04-01T00:00:00.000Z'),
        date_start: new Date('2023-03-31T00:00:00.000Z'),
        name: 'Updated Test Event',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Updated Test Circuit',
        country_name: 'Updated Test Country',
      };

      const res = await request(app).put(`/calendar/${event.id}`).send(updatedEvent);

      expect(res.status).toBe(200);
      expect(res.body.sponsored_name).toBe(updatedEvent.sponsored_name);
      expect(res.body.date_end).toEqual(updatedEvent.date_end.toISOString());
      expect(res.body.date_start).toEqual(updatedEvent.date_start.toISOString());
      expect(res.body.name).toBe(updatedEvent.name);
      expect(res.body.season_id).toBe(updatedEvent.season_id);
      expect(res.body.year).toBe(updatedEvent.year);
      expect(res.body.circuit_name).toBe(updatedEvent.circuit_name);
      expect(res.body.country_name).toBe(updatedEvent.country_name);
    });
  });

  // Delete a MotoGP event by ID
  describe('DELETE /calendar/:id', () => {
    it('should delete a single event', async () => {
      const event = new Calendar({
        sponsored_name: 'Test Event',
        date_end: new Date('2023-03-01T00:00:00.000Z'),
        date_start: new Date('2023-02-28T00:00:00.000Z'),
        name: 'Test Event',
        season_id: '2023',
        year: 2023,
        circuit_name: 'Test Circuit',
        country_name: 'Test Country',
      });

      await event.save();

      const res = await request(app).delete(`/calendar/${event.id}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Event deleted successfully');
    });
  });
});

