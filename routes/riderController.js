const express = require('express');
const Rider = require('../models/Rider'); // Đường dẫn đến mô hình Rider

const router = new express.Router();

// Tạo tay đua mới
router.post('/riders', async (req, res) => {
    try {
        const rider = new Rider(req.body);
        await rider.save();
        res.status(201).send(rider);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Lấy danh sách tất cả tay đua
router.get('/riders', async (req, res) => {
    try {
        const riders = await Rider.find();
        res.status(200).send(riders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Lấy tay đua theo ID
router.get('/riders/:id', async (req, res) => {
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

// Cập nhật tay đua theo ID
router.patch('/riders/:id', async (req, res) => {
    try {
        const updatedRider = await Rider.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
        if (updatedRider) {
            res.status(200).json(updatedRider);
        } else {
            res.status(404).json({ message: 'Rider not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Xóa tay đua theo ID
router.delete('/riders/:id', async (req, res) => {
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

module.exports = router;
