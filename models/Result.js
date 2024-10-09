const mongoose = require('mongoose');
const uuid = require('uuid');
const Session = require('./Session') // Assuming session model is in the same directory
const Rider = require('./Rider') // Assuming rider model is in the same directory
const Calendar = require('./Calendar') // Assuming calendar model is in the same directory
const Teams = require('./Team') // Assuming team model is in the same directory
const ResultSchema = new mongoose.Schema({
    riderID: {
        type: String,
        required: true,
        ref: 'Rider' // Assuming you have a Rider model
    },
    id:{
        type: String,
        default: () => uuid.v4(),
        required: true,
        unique: true
    },
    position: {
        type: Number,
        required: false
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
    },
    points: {
        type: Number,
    }
    
});

function convertTime(time) {
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
        throw new Error('Invalid time format. Expected format: m:s');
    }

    const minutes = parseInt(timeParts[0], 10);
    const seconds = parseFloat(timeParts[1], 10);

    // Convert total time to seconds
    const totalSeconds = minutes * 60 + seconds;

    return totalSeconds
}


function assignPoints(finishTimes, raceType) {
    const mainRacePoints = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // Top 15 finishers
    const sprintRacePoints = [12, 9, 7, 6, 5, 4, 3, 2, 1]; // Top 9 finishers

    // Create an array of rider indices sorted by their finish times
    const sortedRiders = finishTimes
        .map((time, index) => ({ index, time }))
        .sort((a, b) => a.time - b.time)
        .map(rider => rider.index);

    // Select the appropriate points system
    let points;
    if (raceType === 'RAC') {
        points = mainRacePoints;
    } else if (raceType === 'SPR') {
        points = sprintRacePoints;
    } else {
        points = 0;
    }

    // Assign points to riders based on their finishing position
    const riderPoints = {};
    sortedRiders.forEach((riderIndex, position) => {
        if (position < points.length) {
            riderPoints[riderIndex] = points[position];
        } else {
            riderPoints[riderIndex] = 0; // No points for riders outside the point positions
        }
    });

    return riderPoints;
}

async function updateTeamYearlyPoints(teamId) {
    const team = await Teams.findOne({ id: teamId });
    if (!team) {
        console.error("Team not found!");
        return;
    }

    // Find all riders that belong to this team
    const riders = await Rider.find({ teamId: teamId });

    const years = new Set();

    // Collect unique years from riders' results
    for (const rider of riders) {
        const results = await Result.find({ riderID: rider.id });
        for (const result of results) {
            const session = await Session.findOne({ id: result.sessionId });
            if (session) {
                const calendarEvent = await Calendar.findOne({ id: session.eventId });
                if (calendarEvent) {
                    const eventYear = new Date(calendarEvent.date_start).getFullYear();
                    years.add(eventYear); // Add unique years
                }
            }
        }
    }

    // Initialize or clear yearlyPoints for the team
    team.yearlyPoints = {}

    // Sum points for each year
    for (const year of years) {
        let totalYearPoints = 0;

        for (const rider of riders) {
            const results = await Result.find({ riderID: rider.id });

            for (const result of results) {
                const session = await Session.findOne({ id: result.sessionId });
                if (session) {
                    const calendarEvent = await Calendar.findOne({ id: session.eventId });
                    if (calendarEvent) {
                        const eventYear = new Date(calendarEvent.date_start).getFullYear();
                        if (eventYear === year) {
                            totalYearPoints += result.points || 0; // Sum points for the year
                        }
                    }
                }
            }
        }

        // Update the team's yearly points for this year
        team.yearlyPoints[year] = totalYearPoints; // Set total points for this year
    }

    await team.save(); // Save the updated team
}


// To track if an update is in progress

let isUpdating = false; // Move this outside to control updates globally


async function updatePointsForSession(sessionId) {
    if (isUpdating) return; // Prevent re-entry if updating is in progress

    // let isDeleted = false
    const session = await Session.findOne({ id: sessionId });
    if (!session) {
        console.error("Session not found.");
        return;
    }

    // Fetch all results for the session
    const results = await Result.find({ sessionId }).sort({ time: 1 });
    const finishTimes = results.map(result => convertTime(result.time));
    const points = assignPoints(finishTimes, session.sessionName);

    isUpdating = true; // Set flag to indicate update is in progress

    // Update results with calculated points
    for (let index in results) {
        results[index].points = points[index] || 0; // Assign points or 0 if not present
    }

    // Sort results by points in descending order
    results.sort((a, b) => {
        if (b.points === a.points) {
            return a.position - b.position; // Maintain order in case of ties
        }
        return b.points - a.points; // Sort by points descending
    });

    // Update positions based on points
    let currentPosition = 1; // Start position from 1
    for (let i = 0; i < results.length; i++) {
        if (i > 0 && convertTime(results[i].time) !== convertTime(results[i - 1].time)) {
            currentPosition = i + 1; // Update position only if points are different
        }
        results[i].position = currentPosition;
        await results[i].save(); // Save updated document
    }

    isUpdating = false; // Reset flag after updates
}

async function updateTotalPointsForAllRiders() {
    
        const riders = await Rider.find();
        for(const rider of riders){
            if (rider) {
                // Find the results for the rider
                const results = await Result.find({ riderID: rider.id });
                const years = new Set(); // To store unique years
                
                // Collect unique years from results
                for (const result of results) {
                    const session = await Session.findOne({ id: result.sessionId });
                    if (session) {
                        const calendarEvent = await Calendar.findOne({ id: session.eventId }); // Assuming calendar events are linked
                        if (calendarEvent) {
                            const eventYear = new Date(calendarEvent.date_start).getFullYear();
                            years.add(eventYear); // Add the year to the Set for uniqueness
                        }
                    }
                }
                
                console.log("Unique years for rider:", years); // Debugging line
                 // Initialize yearlyPoints as a fresh object
                 rider.yearlyPoints = {};
                
                // Calculate total points for each year
                for (const year of years) {
                    // Collect results for the current year
                    let totalYearPoints = 0;
        
                    for (const result of results) {
                        const session = await Session.findOne({ id: result.sessionId });
                        if (session) {
                            const calendarEvent = await Calendar.findOne({ id: session.eventId });
                            if (calendarEvent) {
                                const eventYear = new Date(calendarEvent.date_start).getFullYear();
        
                                if (eventYear === year) {
                                    // accumulate points for the current year
                                    totalYearPoints += result.points || 0; 
                                }
                            }
                        }
                    }
        
                    // Update the rider's yearly points
                    rider.yearlyPoints[year] = totalYearPoints; // Set total points for this year
                    console.log("year: ", year, "totalYearPoints: ", totalYearPoints); // Debugging output
                }
        
                
                    rider.totalPoints = Object.values(rider.yearlyPoints).reduce((sum, points) => sum + points, 0)
                
                // console.log("Rider object: ",rider)
                await rider.save(); // Save the updated rider
                await updateTeamYearlyPoints(rider.teamId)
            }
        }
    
}






// Middleware for updating results (save)
ResultSchema.post('save', async function (doc) {
    if (!isUpdating) {
        await updatePointsForSession(doc.sessionId);
        await updateTotalPointsForAllRiders(); // Update total points for the rider
    }
});


// Middleware for updating results (updateMany)
ResultSchema.post('findOneAndUpdate', async function(doc) {
    if (!isUpdating && doc) {
        await updatePointsForSession(doc.sessionId);
        await updateTotalPointsForAllRiders(); // Update total points for the rider
    }
});

let sessionIdToUpdate; // Store sessionId to update
let riderIDtoUpdate
// Middleware for deleting results (pre)
ResultSchema.pre('deleteOne', function(next) {
    const doc = this.getFilter(); // Get the filter object for deletion
    this.model.findOne(doc).then(document => {
        if (document) {
            sessionIdToUpdate = document.sessionId; // Store the sessionId
            riderIDtoUpdate = document.riderID
        }
        next();
    }).catch(next);
});

// Middleware for deleting results (post)
ResultSchema.post('deleteOne', async function() {
    if (!isUpdating && sessionIdToUpdate) {
        await updatePointsForSession(sessionIdToUpdate); // Update points for the session
        await updateTotalPointsForAllRiders(); // Update rider positions after the deletion
    }
    sessionIdToUpdate = null; // Reset after processing
});


// Middleware for updating results (update)
ResultSchema.post('updateMany', async function(result) {
    const sessionId = result.getFilter().sessionId; // Assuming you are passing sessionId in the filter
    if (!isUpdating && sessionId) {
        await updatePointsForSession(sessionId);
        await updateTotalPointsForAllRiders(); // Update total points for the rider(s)
    }
});

// Middleware for updating documents after findOneAndUpdate
ResultSchema.post('findByIdAndUpdate', async function(doc) {
    if (!isUpdating && doc) {
        await updatePointsForSession(doc.sessionId);
        await updateTotalPointsForAllRiders(); // Update total points for the rider
    }
});

// Middleware for removing documents after findOneAndRemove
ResultSchema.post('findOneAndRemove', async function(doc) {
    if (!isUpdating && doc) {
        await updatePointsForSession(doc.sessionId);
        await updateTotalPointsForAllRiders(); // Update total points for the rider
    }
});


const Result = mongoose.model('Result', ResultSchema);

module.exports = {updatePointsForSession, updateTotalPointsForAllRiders,Result};