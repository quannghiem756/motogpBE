// models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    sessions: [
        {
            sessionName: {
                type: String,
                required: true
            },
            sessionDate: {
                type: Date,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            results: [ResultSchema] // Embed results in the session
        }
    ]
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
