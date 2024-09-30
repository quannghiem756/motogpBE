const express = require('express');
const Session = require('../models/Session'); // Adjust the import path if necessary
const router = express.Router();

// Create a new session
router.post('/sessions', async (req, res) => {
    try {
        const session = new Session(req.body);
        await session.save();
        res.status(201).send(session);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all sessions
router.get('/sessions', async (req, res) => {
    try {
        const sessions = await Session.find();
        res.send(sessions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a single session by ID
router.get('/sessions/:id', async (req, res) => {
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
router.patch('/sessions/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['sessionName', 'sessionDate', 'category', 'eventId'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).send();
        }

        updates.forEach(update => session[update] = req.body[update]);
        await session.save();
        res.send(session);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a session by ID
router.delete('/sessions/:id', async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);
        if (!session) {
            return res.status(404).send();
        }
        res.send(session);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
