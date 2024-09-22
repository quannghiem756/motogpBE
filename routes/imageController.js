const express = require('express');
const router = express.Router();
const DefaultImages = require('../models/DefaultImages'); // Path to your Mongoose model

// Create a new default image
router.post('/defaultImages', async (req, res) => {
    try {
        const newDefaultImage = new DefaultImages(req.body);
        await newDefaultImage.save();
        res.status(201).json(newDefaultImage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all default images
router.get('/defaultImages', async (req, res) => {
    try {
        const defaultImages = await DefaultImages.find();
        res.status(200).json(defaultImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // Get a single default image by ID
// router.get('/defaultImages/:id', async (req, res) => {
//     try {
//         const defaultImage = await DefaultImages.findOne({ _id: req.params.id });
//         if (defaultImage) {
//             res.status(200).json(defaultImage);
//         } else {
//             res.status(404).json({ message: 'Default image not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Update a default image by ID
router.patch('/defaultImages/:id', async (req, res) => {
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
router.delete('/defaultImages/:id', async (req, res) => {
    try {
        await DefaultImages.findByIdAndRemove(req.params.id);
        res.status(200).json({ message: 'Default image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET route to return images based on category
// router.get('/defaultImages/:category', (req, res) => {
//     const category = req.params.category;

//     // Filter images based on category
//     const filteredImages = images.filter(img => img.category === category);

//     if (filteredImages.length > 0) {
//         res.json(filteredImages);
//     } else {
//         res.status(404).json({ message: 'No images found for this category.' });
//     }
// });
// Get a single default image by ID
router.get('/defaultImages/:category', async (req, res) => {
    try {
        const defaultImage = await DefaultImages.find({ category: req.params.category });
        if (defaultImage) {
            res.status(200).json(defaultImage);
        } else {
            res.status(404).json({ message: 'Default image not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;