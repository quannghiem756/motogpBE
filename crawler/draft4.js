// // Define the points system for main race and sprint race
// const mainRacePoints = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // Top 15 finishers
// const sprintRacePoints = [12, 9, 7, 6, 5, 4, 3, 2, 1]; // Top 9 finishers

// /**
//  * Assign points based on rider finish times.
//  * 
//  * @param {Array<number>} finishTimes - List of rider finish times (lower is better).
//  * @param {string} raceType - Either "main" for the main race or "sprint" for the sprint race.
//  * @returns {Object} A dictionary mapping each rider (by index) to their assigned points.
//  */
// function assignPoints(finishTimes, raceType = "main") {
//     // Create an array of rider indices sorted by their finish times
//     const sortedRiders = finishTimes
//         .map((time, index) => ({ index, time }))
//         .sort((a, b) => a.time - b.time)
//         .map(rider => rider.index);

//     // Select the appropriate points system
//     let points;
//     if (raceType === "main") {
//         points = mainRacePoints;
//     } else if (raceType === "sprint") {
//         points = sprintRacePoints;
//     } else {
//         throw new Error("Invalid race type. Choose either 'main' or 'sprint'.");
//     }

//     // Assign points to riders based on their finishing position
//     const riderPoints = {};
//     sortedRiders.forEach((riderIndex, position) => {
//         if (position < points.length) {
//             riderPoints[riderIndex] = points[position];
//         } else {
//             riderPoints[riderIndex] = 0; // No points for riders outside the point positions
//         }
//     });

//     return riderPoints;
// }

// // Example usage:
// const finishTimes = [87.32, 85.12, 90.45, 88.67, 84.99, 92.34, 86.56, 89.21, 83.78, 91.02, 87.95, 93.17, 85.89, 88.23, 90.76, 86.11, 89.58, 84.32, 91.89, 87.63]; // Example times in seconds
// const raceType = "main"; // Can be either "main" or "sprint"

// const pointsAssigned = assignPoints(finishTimes, raceType);
// console.log("Points assigned to riders (by index):", pointsAssigned);

function convertTime(time) {
    const timeParts = time.split(':');
    if (timeParts.length !== 3) {
        throw new Error('Invalid time format. Expected format: m:s:ms');
    }

    const minutes = parseInt(timeParts[0], 10);
    const seconds = parseInt(timeParts[1], 10);
    const milliseconds = parseInt(timeParts[2], 10);

    // Convert total time to seconds
    const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;

    return totalSeconds
}

console.log(convertTime('1:23:456')) // Output: 83.456