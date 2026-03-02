const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({

    item: {
        type: String,
        required: true
    },

    criteria: {
        type:Object
    },

    options: [
        {
            id: Number,
            name: String
        }
    ],

    scores: {
        type: Object
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    userMail: {
        type: String,
        required: true
    },
    finalScores: [
        {
            option: String,
            score: Number
        }
    ],

    ranking: [
        {
            option: String,
            score: Number
        }
    ],

    winner: {
        type: String
    },

    explanation: {
        type: String
    }

});

module.exports = mongoose.model("Decision", decisionSchema);
