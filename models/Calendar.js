const mongoose = require('mongoose');
const uuid = require('uuid');

const CalendarSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid.v4()
    },
    sponsored_name: {
        type: String,
        required: true
    },
    date_end: {
        type: String,
        required: true
    },
    date_start: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    season_id: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: false
    },
    circuit_name: {
        type: String,
        required: true
    },
    country_name: {
        type: String,
        required: true
    },
    circuit_img: {
        type: String,
        required: false
    },
    sponsored_img: {
        type: String,
        required: false
    },

    circuit_track_img: {
        type: String,
        required: false
    },
    flag_img: {
        type: String,
        required: false
    },
    sessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session' // Reference to the Session model
    }]
});

const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = Calendar;

