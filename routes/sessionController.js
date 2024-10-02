const express = require('express');
const Session = require('../models/Session'); // Adjust the import path if necessary
const router = express.Router();

// Create a new session
router.post('/api/sessions', async (req, res) => {
    try {
        const session = new Session(req.body);
        console.log(session)
        await session.save();
        res.status(201).send(session);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all sessions
router.get('/api/sessions', async (req, res) => {
    try {
        const sessions = await Session.find();
        res.send(sessions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a single session by ID
router.get('/api/sessions/:id', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).send();
        }
        res.send(session);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a session by ID
router.put('/api/sessions/:id', async (req, res) => {
    try {
        const updatedSession = await Session.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (updatedSession) {
            res.status(200).json(updatedSession);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a session by ID
router.delete('/api/sessions/:id', async (req, res) => {
    try {
        const result = await Session.deleteOne({ id: req.params.id });
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
