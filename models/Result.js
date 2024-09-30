const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Rider' // Assuming you have a Rider model
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
    fullname: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session' 
    }
    
});

const Result = mongoose.model('Result', ResultSchema);

module.exports = Result;