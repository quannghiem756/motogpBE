const express = require('express');
const router = express.Router();
const DefaultImages = require('../models/DefaultImages'); // Path to your Mongoose model

// Create a new default image
router.post('/api/defaultImages', async (req, res) => {
    try {
        const newDefaultImage = new DefaultImages(req.body);
        await newDefaultImage.save();
        res.status(201).json(newDefaultImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all default images
router.get('/api/defaultImages', async (req, res) => {
    try {
        const defaultImages = await DefaultImages.find();
        res.status(200).json(defaultImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a default image by ID
router.patch('/api/defaultImages/:id', async (req, res) => {
    try {
        const updatedDefaultImage = await DefaultImages.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedDefaultImage) {
            res.status(200).json(updatedDefaultImage);
        } else {
            res.status(404).json({ message: 'Default image not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Delete a default image by ID
router.delete('/api/defaultImages/:id', async (req, res) => {
    try {
        await DefaultImages.findByIdAndRemove(req.params.id);
        res.status(200).json({ message: 'Default image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get default images by category
router.get('/api/defaultImages/:category', async (req, res) => {
    try {
        const defaultImages = await DefaultImages.find({ category: req.params.category });
        if (defaultImages.length > 0) {
            res.status(200).json(defaultImages);
        } else {
            res.status(404).json({ message: 'No default images found for this category.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;