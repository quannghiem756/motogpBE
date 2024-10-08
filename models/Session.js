// models/Session.js
const mongoose = require('mongoose');
const uuid = require('uuid')
const SessionSchema = new mongoose.Schema({
    id:{
        type: String,
        default: () => uuid.v4(),
        required: true,
        unique: true
    },
    sessionName: {
        type: String,
        required: false
    },
    sessionDate: {  
        type: Date,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    eventId:{
        type: String,
        default: () => uuid.v4(),
        ref: 'Calendar'
    },
});


const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
