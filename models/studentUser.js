/**
 * Created by r on 4/11/16.
 */
var mongoose = require('mongoose');

// Define our beer schema
var studentUserSchema = new mongoose.Schema({
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
    courseList: { type: [String], default:[] },
    courseTaskList:  [{courseTaskid:String, timespent:Number}],
    personalTaskList: [{personalTaskid:String, timespent:Number}],
    todoList: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('studentUser', studentUserSchema);

