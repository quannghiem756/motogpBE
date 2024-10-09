const mongoose = require('mongoose');
const uuid = require('uuid');

const RiderSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => uuid.v4()
    },
    driverNb: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
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
    totalPoints: {      //current season point
        type: Number,
        default: 0
    },
    position: {     //current season postion
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
    
    imageUrl: {
        type: String,
        required: false
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
