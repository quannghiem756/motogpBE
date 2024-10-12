const mongoose = require('mongoose');
const uuid = require('uuid');

const RiderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid.v4()
    },
    name: {
        type: String,
        required: false
    },
    driverNb: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        ref: 'Team'
    },
    constructor_name: {
        type: String,
        require: false
    },
    rider_country_iso: {
        type: String,
        require: false
    },
    year: {
        type: Number,
        require: false
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    position: {
        type: Number,
        required: false
    },
    team_color:{
        type: String,
        required: false
    },
    text_color:{
        type: String,
        required: false
    },
    riderUrl: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: false
    },
    yearlyPoints: {
        type: Object, // Use a simple object instead of Map
        default: {}
    },
});

const Rider = mongoose.model('Rider', RiderSchema);

module.exports = Rider;
