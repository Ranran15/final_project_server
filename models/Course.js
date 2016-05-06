// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    homepage:String,
    instructorid:String,
    instructorName:String,
    courseTaskList: [{courseid:String,
                      courseName:String,
                      name:String, 
                      description:String,
                      releaseDate: {type:Date, default:Date.now},
                      dueDate:Date,
                      averageTimeSpent:Number}],
    studentList: [String]
});

// Export the Mongoose model
module.exports = mongoose.model('Course', CourseSchema);
