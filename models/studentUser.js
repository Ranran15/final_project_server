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
    courseList: [{courseid:String, courseName:String}],
    courseTaskList:  [{courseid:String, courseTaskid:String, timespent:Number}],
    personalTaskList: [{courseid:String,
                        courseName:String, 
                        name:String, 
                        description:String, 
                        releaseDate: {type: Date, default: Date.now },
                        dueDate: Date,
                        timespent:Number}],
    todoList: [{courseid:String,
                courseName:String,
                taskid:String,
                taskName:String,
                description:String,
                start:Date,
                end:Date
                }]
});

// Export the Mongoose model
module.exports = mongoose.model('studentUser', studentUserSchema);

