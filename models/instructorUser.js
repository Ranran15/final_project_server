/**
 * Created by r on 4/18/16.
 */

var mongoose = require('mongoose');

// Define our beer schema
var instructorUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    courseList: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('instructorUser', instructorUserSchema);

