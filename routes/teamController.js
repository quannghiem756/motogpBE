// routes/teamController.js
const express = require('express');
const Team = require('../models/Team'); // Đường dẫn đến mô hình Team

const router = new express.Router();

// Tạo đội mới
router.post('/api/teams', async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).send(team);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Lấy danh sách tất cả đội
router.get('/api/teams', async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).send(teams);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Lấy đội theo ID
router.get('/api/teams/:id', async (req, res) => {
    try {
        const team = await Team.findOne({ _id: req.params.id });
        if (!team) {
            return res.status(404).send('Team not found');
        }
        res.status(200).send(team);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Cập nhật đội theo ID
router.patch('/api/teams/:id', async (req, res) => {
    try {
        const updatedTeam = await Team.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
        if (updatedTeam) {
            res.status(200).json(updatedTeam);
        } else {
            res.status(404).json({ message: 'Team not found' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;