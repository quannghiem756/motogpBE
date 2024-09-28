// models/Session.js
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
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
    results: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Result'}] 
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
