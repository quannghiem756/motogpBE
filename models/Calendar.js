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
        type: Date,
        required: true
    },
    date_start: {
        type: Date,
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
        required: true
    },
    circuit_name: {
        type: String,
        required: true
    },
    country_name: {
        type: String,
        required: true
    }
});

const Calendar = mongoose.model('Calendar', CalendarSchema);

module.exports = Calendar;

