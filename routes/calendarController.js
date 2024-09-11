const express = require('express');
const router = express.Router();
const Calendar = require('../models/Calendar'); // Path to your Mongoose model

// Create a new MotoGP event
router.post('/calendar', async (req, res) => {
    try {
        const newEvent = new Calendar(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all MotoGP events
router.get('/calendar', async (req, res) => {
    try {
        const events = await Calendar.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single MotoGP event by ID
router.get('/calendar/:id', async (req, res) => {
    try {
        const event = await Calendar.findOne({ id: req.params.id });
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a MotoGP event by ID
router.put('/calendar/:id', async (req, res) => {
    try {
        const updatedEvent = await Calendar.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (updatedEvent) {
            res.status(200).json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a MotoGP event by ID
router.delete('/calendar/:id', async (req, res) => {
    try {
        const result = await Calendar.deleteOne({ id: req.params.id });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Event deleted' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
