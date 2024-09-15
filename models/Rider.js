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
        required: true
    },
    team: {
        type: String,
        required: true
    },
    championships: {
        type: Number,
        default: 0
    },
    raceWins: {
        type: Number,
        default: 0
    },
    podiums: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    story: {  // Thêm trường câu chuyện
        type: String,
        required: false // Không bắt buộc
    }
});

const Rider = mongoose.model('Rider', RiderSchema);

module.exports = Rider;
