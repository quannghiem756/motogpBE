// models/defaultImages.js
const mongoose = require('mongoose');

const defaultImagesSchema = new mongoose.Schema({
  // circuitTrackImage: {
  //   type: [String],
  //   required: true
  // },
  // eventImage: {
  //   type: [String],
  //   required: true
  // },
  // sponsoredImages: {
  //   type: [String],
  //   required: true
  // }
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