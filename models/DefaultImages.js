// models/defaultImages.js
const mongoose = require('mongoose');

const defaultImagesSchema = new mongoose.Schema({
  
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const DefaultImages = mongoose.model('DefaultImages', defaultImagesSchema);

module.exports = DefaultImages;