/**
 * Created by r on 4/11/16.
 */
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    pendingTasks: [String],
    dateCreated: { type: Date, default: Date.now }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
