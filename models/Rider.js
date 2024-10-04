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
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    constructor_name: {
        type: String,
        require: true
    },
    rider_country_iso: {
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    position: {
        type: Number,
        required: true
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
    }
});

const Rider = mongoose.model('Rider', RiderSchema);

module.exports = Rider;
