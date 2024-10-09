// routes/teamController.js
const express = require('express');
const Team = require('../models/Team'); // Path to Team model

const router = new express.Router();

// Create a new team
router.post('/api/teams', async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).send(team);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get a list of all teams
router.get('/api/teams', async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).send(teams);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a team by ID
router.get('/api/teams/:id', async (req, res) => {
    try {
        const team = await Team.findOne({ id: req.params.id });
        if (!team) {
            return res.status(404).send('Team not found');
        }
        res.status(200).send(team);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a team by ID
router.patch('/api/teams/:id', async (req, res) => {
    try {
        const updatedTeam = await Team.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (updatedTeam) {
            res.status(200).json(updatedTeam);
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete a team by ID
router.delete('/api/teams/:id', async (req, res) => {
    try {
        const deletedTeam = await Team.findOneAndDelete({ id: req.params.id });
        if (!deletedTeam) {
            return res.status(404).send('Team not found');
        }
        res.status(200).send(deletedTeam); // You can send back the deleted team data if needed
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

module.exports = router;
