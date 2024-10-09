const mongoose = require('mongoose');
const uuid = require('uuid');

const ResultSchema = new mongoose.Schema({
    riderID: {
        type: String,
        required: true,
        ref: 'Rider' 
    },
    id:{
        type: String,
        default: () => uuid.v4(),
        required: true,
        unique: true
    },
    position: {
        type: Number,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    sessionId:{
        type: String,
        // unique: true,
        default: () => uuid.v4(),
        ref: 'Session' 
    }
    
});

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;