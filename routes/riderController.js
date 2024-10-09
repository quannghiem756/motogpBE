const express = require('express');
const Rider = require('../models/Rider'); // Đường dẫn đến mô hình Rider

const router = new express.Router();

// Tạo tay đua mới
router.post('/api/riders', async (req, res) => {
    try {
        const rider = new Rider(req.body);
        await rider.save();
        res.status(201).send(rider);
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
});

// Lấy danh sách tất cả tay đua
router.get('/api/riders', async (req, res) => {
    try {
        const riders = await Rider.find();
        console.log('fetch all');
        res.status(200).send(riders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Lấy tay đua theo ID
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

// Example PUT route to update a rider by ID
router.patch('/api/riders/:id', async (req, res) => {
    try {
      const updatedRider = await Rider.findOneAndUpdate( //method from monogodb
        { id: req.params.id }, // Search condition (find rider by ID)
        req.body,              // Updated rider data from the request body
        { new: true, runValidators: true } // Options: 'new' to return the updated document, 'runValidators' to enforce schema validation
      );
      
      if (!updatedRider) {
        return res.status(404).send('Rider not found');
      }
      
      res.status(200).json(updatedRider);
      console.log('update done');
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.log(error);
    }
  });

// Xóa tay đua theo ID
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

module.exports = router;
