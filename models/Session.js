// models/Session.js
const mongoose = require('mongoose');
const uuid = require('uuid')

// const Rider = require('./Rider'); // Import the Rider model
// const { updatePointsForSession, updateTotalPoints, Result } = require('./Result');


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

// SessionSchema.post('findOneAndUpdate', async function(doc) {
//     // Get the old session name (original document) 
//     const originalSession = await this.model.findOne({id : doc.id});
//     const oldSessionName = originalSession.sessionName;
//     const newSessionName = doc.sessionName;  

//     if (oldSessionName !== newSessionName) {
//         // Update points for all results associated with this session
//         const results = await Result.find({ sessionId: doc.id });
//         const riders = await Rider.find({id: results.map(result => result.riderID)}); // Fetch all riders associated with the results
//         await updatePointsForSession(doc.id); // Recalculate points based on updated session name
//         for(const rider in riders) {
//             await updateTotalPoints(rider.id); // Recalculate points based on updated session name
//         }
//     }
// });



const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
