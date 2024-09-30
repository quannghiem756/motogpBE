// routes/resultController.js
const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

// Function to fetch results for a specific session within a specific calendar event
router.get('/result', async (req, res) => {
    try {
        const { eventId, sessionId } = req.params;

        // Find the session with the given ID in the specified calendar event
        const calendarEvent = await Calendar.findOne({
            _id: eventId,
            'sessions._id': sessionId
        }).populate({
            path: 'sessions',
            match: { _id: sessionId },
            populate: 'results'
        });

        if (!calendarEvent) {
            return res.status(404).json({ message: 'Calendar event or session not found' });
        }

        const session = calendarEvent.sessions[0];
        return res.status(200).json(session.results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Function to create a new result
router.post('/result', async (req, res) => {
    try {
        const { riderId, position, time, number, fullname, flag, team } = req.body;

        if (!riderId || !position || !time || !number || !fullname || !flag || !team) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const resultData = {
            riderId,
            position,
            time,
            number,
            fullname,
            flag,
            team
        };

        const result = new Result(resultData);
        await result.save();

        return res.status(201).json({ message: 'Result created successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
