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
    // flag: {
    //     type: String,
    //     required: true
    // },
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


let isUpdating = false; // Move this outside to control updates globally


//Support fuction--------------------------------------------

function convertTime(time) {
    console.log(time);
    const timeParts = time.split(':');

    // Check if the provided time format is correct
    if (timeParts.length !== 3) {
        throw new Error('Invalid time format. Expected format: m:s:ms');
    }

    const minutes = parseInt(timeParts[0], 10); // Get minutes
    const seconds = parseFloat(timeParts[1], 10); // Get seconds
    const milliseconds = parseFloat(timeParts[2], 10); // Get milliseconds

    // Convert total time to milliseconds
    const totalMilliseconds = (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;

    return totalMilliseconds;
}

// function convertTime(time) {
//     const timeParts = time.split(':');
//     if (timeParts.length !== 2) {
//         throw new Error('Invalid time format. Expected format: m:s');
//     }

//     const minutes = parseInt(timeParts[0], 10);
//     const seconds = parseFloat(timeParts[1], 10);

//     // Convert total time to seconds
//     const totalSeconds = minutes * 60 + seconds;

//     return totalSeconds
// }




function assignPoints(finishTimes, raceType) {
    const mainRacePoints = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // Top 15 finishers
    const sprintRacePoints = [12, 9, 7, 6, 5, 4, 3, 2, 1]; // Top 9 finishers

    // Create an array of rider indices sorted by their finish times
    const sortedRiders = finishTimes
        .map((time, index) => ({ index, time }))
        .sort((a, b) => a.time - b.time);

    // Select the appropriate points system
    let points;
    if (raceType === 'RAC') {
        points = mainRacePoints;
    } else if (raceType === 'SPR') {
        points = sprintRacePoints;
    } else {
        points = [];
    }

    // Assign points to riders based on their finishing position
    const riderPoints = Array(finishTimes.length).fill(0); // Default all to 0
    let currentPoints = 0;
    let lastTime = null;

    sortedRiders.forEach(({ index, time }, position) => {
        if (position < points.length) {
            if (lastTime === null || time !== lastTime) {
                currentPoints = points[position]; // Update the current points for new finish time
            }
            riderPoints[index] = currentPoints; // Assign points based on index
        }
        lastTime = time; // Update lastTime to the current time
    });

    console.log("Finish Times: ", finishTimes);
    console.log("Sorted Riders: ", sortedRiders.map(r => `{index: ${r.index}, time: ${r.time}}`));
    console.log("Assigned Points: ", riderPoints);

    return riderPoints;
}

async function updateTeamYearlyPoints(teamId) {
    const team = await Teams.findOne({ _id: teamId });

    if (!team) {
        console.log('Team not found!');
        return;
    }

    // Find all results that belong to this team
    const results = await Result.find({ team: teamId }); // Fetch all results for the specified team

    // Collect unique rider IDs from the results
    const riderIdsInResults = results.map(result => result.riderID);
    //console.log('Rider IDs in results for team:', riderIdsInResults);

    // Filter riders from the Rider model that are in results
    const riders = await Rider.find({ id: { $in: riderIdsInResults } });

    const years = new Set();

    // Collect unique years from riders' results
    for (const rider of riders) {
        const riderResults = await Result.find({ riderID: rider.id });
        for (const result of riderResults) {
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

    //console.log("Unique years for Team:", years);

    // Initialize or clear yearlyPoints for the team
    team.yearlyPoints = {};

    // Sum points for each year
    for (const year of years) {
        let totalYearPoints = 0;

        for (const rider of riders) {
            const riderResults = await Result.find({ riderID: rider.id });

            for (const result of riderResults) {
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
        console.log('Year Team:', year, 'Total Year Points:', totalYearPoints);
    }
    
    await team.save(); // Save the updated team
}





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
        // if (b.points === a.points) {
        //     return a.position - b.position; // Maintain order in case of ties
        // }
        return convertTime(a.time) - convertTime(b.time); // Sort by points descending
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
    const results = await Result.find(); // Fetch all results
    const riders = await Rider.find(); // Fetch all riders


    // Ensure results is not empty before iterating
    console.log("Results before updating team points:", results);
    if (results.length > 0) {
        for (const result of results) {
            console.log("Updating team points for team ID:", result.team);
            await updateTeamYearlyPoints(result.team);
            console.log("Successfully updated team yearly points");
        }
    } else {
        console.log("No results available to update team points");
    }

    for (const rider of riders) {
        if (rider) {
            // Find the results for the rider
            const results = await Result.find({ riderID: rider.id });
            const years = new Set(); // To store unique years
            
            // Collect unique years from results
            for (const result of results) {
                const session = await Session.findOne({ id: result.sessionId });
                if (session) {
                    const calendarEvent = await Calendar.findOne({ id: session.eventId });
                    if (calendarEvent) {
                        const eventYear = new Date(calendarEvent.date_start).getFullYear();
                        years.add(eventYear); // Add the year to the Set for uniqueness
                    }
                }
            }

            // Initialize yearlyPoints as a fresh object
            rider.yearlyPoints = {};
            
            // Calculate total points for each year
            for (const year of years) {
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
                console.log('Year riders:', year, 'Total Year Points:', totalYearPoints);
            }
            
            rider.totalPoints = Object.values(rider.yearlyPoints).reduce((sum, points) => sum + points, 0);
            await rider.save(); // Save the updated rider
            console.log("Successfully updated riders yearly points");
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