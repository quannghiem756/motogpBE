// routes/resultController.js
const express = require('express');
const router = express.Router();
const {updatePointsForSession, updateTotalPointsForAllRiders,Result} = require('../models/Result');
const Calendar = require('../models/Calendar');
const Session = require('../models/Session')
// Function to fetch results for a specific session within a specific calendar event
// router.get('/api/result', async (req, res) => {
//     try {
//         const { eventId, sessionId  } = req.params;

//         // Find the session with the given ID in the specified calendar event
//         const calendarEvent = await Calendar.findOne({
//             _id: eventId,
//             'sessions._id': sessionId
//         }).populate({
//             path: 'sessions',
//             match: { _id: sessionId },
//             populate: 'results'
//         });

//         if (!calendarEvent) {
//             return res.status(404).json({ message: 'Calendar event or session not found' });
//         }

//         const session = calendarEvent.sessions[0];
//         return res.status(200).json(session.results);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// Function to calculatePoints based on rider's time in each session
    

router.get('/api/result', async (req, res) => {
    try {
        const {eventId, sessionName, category} = req.query; // Assume eventId and sessionId are provided in the request query parameters
        if (eventId && sessionName) {
            const session = await Session.findOne({eventId: eventId, sessionName: sessionName, category: category});
            if (!session) {
                return res.status(404).json({ message: 'Session not found'})
            }
            const results = await Result.find({ sessionId: session.id });
            res.send(results)
        } else{
            const sessions = await Result.find();
            res.send(sessions);
        }
       
    } catch (error) {
        res.status(500).send('Internal Server Error'); // Send error response
    }
});

// Function to create a new result
router.post('/api/result', async (req, res) => {
    try {
        
        const result = new Result(req.body);
        
        await result.save();
        res.status(201).send(result);
    } catch (error) {
        //console.log(error);
        res.status(500).send('Internal Server Error'); // Send error response
    }
});

// Function to update an existing result
router.put('/api/result/:id', async (req, res) => {
    try {
        const updatedResult = await Result.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (updatedResult) {
            res.status(200).json(updatedResult);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Route to update points for a session and all riders
router.post('/api/updatePoints/:sessionId', async (req, res) => {
    try {
        const sessionId  = req.params.sessionId; // Get sessionId from params
        
        if (!sessionId) {
            return res.status(400).json({ message: 'sessionId is required' });
        }

        await updatePointsForSession(sessionId);
        await updateTotalPointsForAllRiders();

        return res.status(200).json({ message: 'Points updated successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' }); // Send a proper error response
    }
});


module.exports = router;


// Function to create a new result
// router.post('/api/result', async (req, res) => {
//     try {
//         const { riderId, position, time, number, fullname, flag, team } = req.body;

//         if (!riderId || !position || !time || !number || !fullname || !flag || !team) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const resultData = {
//             riderId,
//             position,
//             time,
//             number,
//             fullname,
//             flag,
//             team
//         };

//         const result = new Result(resultData);
//         await result.save();

//         return res.status(201).json({ message: 'Result created successfully', result });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// Function to delete a result
router.delete('/api/result/:id', async (req, res) => {
    try {
        const result = await Result.deleteOne({ id: req.params.id });
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
