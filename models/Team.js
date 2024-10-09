  const mongoose = require('mongoose');

  const TeamSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuid.v4()
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    // riders: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Rider'
    // }],
    championships: {
      type: Number,
      default: 0
    },
    raceWins: {
      type: Number,
      default: 0
    },
    podiums: {
      type: Number,
      default: 0
    },
    totalPoints: {
      type: Number,
      default: 0
    },
    teamPrincipal: {
      type: String
    },
    teamManager: {
      type: String
    },
    technicalDirector: {
      type: String
    },
    engineSupplier: {
      type: String
    },
    tyreSupplier: {
      type: String
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now
    // }
    
    yearlyPoints: {
    type: Object, // { year: points }
    default: {}
    }

  });

  const Team = mongoose.model('Team', TeamSchema);

  module.exports = Team;