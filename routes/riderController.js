const express = require('express');
const Rider = require('../models/Rider');
const {updatePointsForSession, updateTotalPointsForAllRiders,Result} = require('../models/Result');
const Session = require('../models/Session'); 

const router = new express.Router();

// Create a new rider
router.post('/api/riders', async (req, res) => {
    try {
        const rider = new Rider(req.body);
        await rider.save();
        res.status(201).send(rider);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get list of all riders
router.get('/api/riders', async (req, res) => {
    try {
        const riders = await Rider.find();
        res.status(200).send(riders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get rider by ID
router.get('/api/riders/:id', async (req, res) => {
    try {
        const rider = await Rider.findOne({ id: req.params.id });
        if (!rider) {
            return res.status(404).send('Rider not found');
        }
        res.status(200).send(rider);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update rider by ID
router.patch('/api/riders/:id', async (req, res) => {
    try {
        const updatedRider = await Rider.findOneAndUpdate({ id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        });
        if (updatedRider) {
            res.status(200).json(updatedRider);
        } else {
            res.status(404).json({ message: 'Rider not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete rider by ID
router.delete('/api/riders/:id', async (req, res) => {
    try {
        const rider = await Rider.deleteOne({ id: req.params.id });
        if (!rider) {
            return res.status(404).send('Rider not found');
        }
        res.status(200).send('Rider deleted');
    } catch (error) {
        res.status(500).send(error);
    }
});

// Standing---------------------------------------------
// Import Team model if you need it, but only if you're actually using it somewhere
const Team = require('../models/Team');

router.get('/api/riderswithpoints/:year/:category/:champ', async (req, res) => {
    const year = parseInt(req.params.year, 10); // Convert year to an integer
    const category = req.params.category; // Get the category from parameters
    const champ = req.params.champ; // Get the category from parameters
    console.log('filter by years:', year);
    console.log('filter sesson by Category:', category);
    console.log('filter by champ:', champ);
    try {
        // Sessions are fetched based on the year
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year + 1}-01-01`);
        console.log('Querying for sessions between:', startDate, 'and', endDate);
        
        const sessions = await Session.find({
            sessionDate: {
                $gte: startDate,
                $lt: endDate
            },category: category // Filter by the category
        }).exec();
        console.log('Fetched sessions:', sessions);

        if (sessions.length === 0) {
            return res.status(404).send('No sessions found for the specified year');
        }

        // Collet result that have filtered sessions
        const sessionIds = sessions.map(session => session.id);
        const results = await Result.find({ sessionId: { $in: sessionIds } }).exec();
        console.log('Fetched results by Sessions(year,category):', results);

        // Collect rider IDs/TeamID from the results
        const riderIdsInResults = results.map(result => result.riderID);
        const teamIdsInResults = results.map(result => result.team)
        //console.log(teamIdsInResults);
        // Filter riders that are in results and have a non-zero yearly point for the specified year
        const riders = await Rider.find({ id: { $in: riderIdsInResults } }) // Only fetch riders in results
            .sort({ [`yearlyPoints.${year}`]: -1 }) // Sort riders by points for the given year
            .exec();

        // Filter teams that are in results and have a non-zero yearly point for the specified year
        const teams = await Team.find({ _id: { $in: teamIdsInResults } }) // Only fetch riders in results
            .sort({ [`yearlyPoints.${year}`]: -1 }) // Sort riders by points for the given year
            .exec();

        // Create a mapping of riderId to team/number from the results to get TeamID/riderNb from result
        const resultsMappingTeam = results.reduce((acc, result) => {
            acc[result.riderID] = result.team
            return acc;
        }, {});
        const resultsMappingNumber = results.reduce((acc, result) => {
            acc[result.riderID] = result.number
            return acc;
        }, {});

        //console.log('Results mapping:', resultsMappingTeam);

        //UpdateRiderNb(year,results);

        if (champ == 'Rider') {
            // Format the riders into the desired structure
            const formattedRiders = riders.map((rider, index) => ({
                tbody_year: year,
                tbody_pos: index + 1,
                rider_image: rider.riderUrl,
                tbody_fullname: rider.name,
                tbody_flag: rider.imageUrl,
                tbody_team: resultsMappingTeam[rider.id] || 'Unknown Team',
                tbody_point: rider.yearlyPoints[year] || 0,
                tbody_number: resultsMappingNumber[rider.id] || 'Unknown Number'
            }));
            console.log('Filtered riders:', riders);
            res.json(formattedRiders);
        } else if (champ == 'Team') {
            const foramtedTeams = teams.map((team, index) => ( {
                tbody_year: year,
                tbody_team: team.name,
                tbody_pos: index + 1,
                tbody_point: team.yearlyPoints[year] || 0,
            }));
            console.log('Filtered teams:', teams);
            res.json(foramtedTeams);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function UpdateRiderNb (year, results) {
    const previousYear = year - 1;
        const previousYearRiders = await Rider.find()
            .sort({ [`yearlyPoints.${previousYear}`]: -1 }) // Sort riders by previous year's points
            .exec();

    // Get the highest-point rider from the previous year
    const highestPointRider = previousYearRiders[0]; // Assuming there is at least one rider
    // If the highestPointRider is found in current results, set number to 1
    
    if (highestPointRider) {
        const riderIndex = results.findIndex(result => result.riderID === highestPointRider.id);
        if (riderIndex !== -1) {
            results[riderIndex].number = 1; // Set the number to 1 for the highest point rider
            await results[riderIndex].save(); // Save the updated result
        }
    }

    // If the highestPointRider is found in current results, set number to 1
    if (highestPointRider) {
        const riderIndex = results.findIndex(result => result.riderID === highestPointRider.id);
        if (riderIndex !== -1) {
            results[riderIndex].number = 1; // Set the number to 1 for the highest point rider
            await results[riderIndex].save(); // Save the updated result
        }
    }
}



module.exports = router;
