// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var courseTask = require('./models/courseTask');
var personalTask = require('./models/personalTask');
var Course = require('./models/Course');
var todo = require('./models/todo');
var studentUser = require('./models/studentUser');
var instructorUser = require('./models/instructorUser');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
//digital ocean
//mongoose.connect('mongodb://localhost/mp4');
//mongoose.connect('mongodb://for498web4:forever1@ds019980.mlab.com:19980/mp4')

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.json());
// All our routes will start with /api
app.use('/api', router);

var studentusersRoute = router.route('/studentusers');
studentusersRoute.post(function(req, res){
  var user = new studentUser();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.courseList = req.body.courseList;

  //console.log("name"+JSON.stringify(req.body.name));
  //console.log("USER: " + JSON.stringify(user));

  user.save(function(err){
    console.log("save");
    if (err) {
      res.status(500).json({ message: "Server error", data: err });
    } else {
      res.status(201).json({message: "OK", data: user});
    }
  });
});

studentusersRoute.get(function(req, res) {
  var where = req.query.where ? JSON.parse(req.query.where) : {},
      sort = eval("("+req.query.sort+")"),
      select = req.query.select ? JSON.parse(req.query.select) : {},
      skip = req.query.skip || 0,
      limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
      count = (req.query.count === "true") || false;

  //console.log("sort"+JSON.stringify(sort)+" where:"+ JSON.stringify(where));
  if (count) {/*mongoose.model('User')*/
    studentUser.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, users) {
      if (err) {
        res.status(500).json({ message: "Server error", data: err });
      } else {
        res.status(200).json({ message: "OK", data: users });
      }
    });
  } else {
    console.log("not count");
    studentUser.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, users) {
      console.log("In execute");
      if(users.length==0){
        res.status(200).json({message: "OK", data: []});
      }else{
        if (err) {
          res.status(500).json({message: "Server error", data: err});
        } else {
          res.status(200).json({message: "OK", data: users});
        }
      }
    });
  }

});

studentusersRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});


var instructorusersRoute = router.route('/instructorusers');
instructorusersRoute.post(function(req, res){
  var user = new instructorUser();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.courseList = req.body.courseList;

  //console.log("name"+JSON.stringify(req.body.name));
  //console.log("USER: " + JSON.stringify(user));

  user.save(function(err){
    console.log("save");
    if (err) {
      res.status(500).json({ message: "Server error", data: err });
    } else {
      res.status(201).json({message: "OK", data: user});
    }
  });
});

instructorusersRoute.get(function(req, res) {
  var where = req.query.where ? JSON.parse(req.query.where) : {},
      sort = eval("("+req.query.sort+")"),
      select = req.query.select ? JSON.parse(req.query.select) : {},
      skip = req.query.skip || 0,
      limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
      count = (req.query.count === "true") || false;

  //console.log("sort"+JSON.stringify(sort)+" where:"+ JSON.stringify(where));
  if (count) {/*mongoose.model('User')*/
    instructorUser.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, users) {
      if (err) {
        res.status(500).json({ message: "Server error", data: err });
      } else {
        res.status(200).json({ message: "OK", data: users });
      }
    });
  } else {
    console.log("not count");
    instructorUser.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, users) {
      console.log("In execute");
      if(users.length==0){
        res.status(200).json({message: "OK", data: []});
      }else{
        if (err) {
          res.status(500).json({message: "Server error", data: err});
        } else {
          res.status(200).json({message: "OK", data: users});
        }
      }
    });
  }

});

instructorusersRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});






var coursesRoute = router.route('/courses');
coursesRoute.post(function(req, res){
  //Tasks cannot be created (or updated) without a name or a deadline.
  /*if (!req.body.name || !req.body.deadline) {
   res.status(500).json({ message: "Server error, no name or deadline", data: {} });
   }*/
  var course = new Course();

  course.name = req.body.name;
  course.description = req.body.description||"";
  course.homepage = req.body.homepage;
  course.instructorid = req.body.instructorid;
  course.instructorName = req.body.instructorName;
  course.courseTaskList = req.body.courseTaskList||[];
  course.studentList = req.body.studentList||[];

  course.save(function(err){
    if (err) {
      res.status(500).json({ message: "Server error", data: err });
    } else {
      res.status(201).json({message: "OK", data: course});
    }
  });
});

coursesRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});

coursesRoute.get(function(req, res) {
  var where = req.query.where ? JSON.parse(req.query.where) : {},
      sort = eval("("+req.query.sort+")"),
      select = req.query.select ? JSON.parse(req.query.select) : {},
      skip = req.query.skip || 0,
      limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
      count = (req.query.count === "true") || false;

  console.log("sort"+JSON.stringify(sort)+" where:"+ JSON.stringify(where));
  if (count) {
    Course.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, courses) {
      if (err) {
        res.status(500).json({ message: "Server error", data: err });
      } else {
        res.status(200).json({ message: "OK", data: courses });
      }
    });
  } else {
    console.log("not count");
    Course.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, courses) {
      console.log("In execute");
      //if(tasks.length==0){
        res.status(200).json({message: "OK", data: []});
     // }else{
        if (err) {
          res.status(500).json({message: "Server error", data: err});
        } else {
          res.status(200).json({message: "OK", data: courses});
     //   }
      }
    });
  }
});


var courseTaskRoute = router.route('/courseTasks');
courseTaskRoute.post(function(req, res){
  //Tasks cannot be created (or updated) without a name or a deadline.
  /*if (!req.body.name || !req.body.deadline) {
   res.status(500).json({ message: "Server error, no name or deadline", data: {} });
   }*/
  var task = new courseTask();

  task.courseid = req.body.courseid;
  task.description = req.body.description||"";
  task.courseName = req.body.courseName;
  task.releaseDate = req.body.releaseDate;
  task.dueDate = req.body.dueDate;

  task.save(function(err){
    if (err) {
      res.status(500).json({ message: "Server error", data: err });
    } else {
      res.status(201).json({message: "OK", data: task});
    }
  });
});

courseTaskRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});

courseTaskRoute.get(function(req, res) {
  var where = req.query.where ? JSON.parse(req.query.where) : {},
      sort = eval("("+req.query.sort+")"),
      select = req.query.select ? JSON.parse(req.query.select) : {},
      skip = req.query.skip || 0,
      limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
      count = (req.query.count === "true") || false;

  console.log("sort"+JSON.stringify(sort)+" where:"+ JSON.stringify(where));
  if (count) {
    courseTask.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, tasks) {
      if (err) {
        res.status(500).json({ message: "Server error", data: err });
      } else {
        res.status(200).json({ message: "OK", data: tasks });
      }
    });
  } else {
    console.log("not count");
    courseTask.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, tasks) {
      console.log("In execute");
      //if(tasks.length==0){
      res.status(200).json({message: "OK", data: []});
      // }else{
      if (err) {
        res.status(500).json({message: "Server error", data: err});
      } else {
        res.status(200).json({message: "OK", data: tasks});
        //   }
      }
    });
  }
});


var personalTaskRoute = router.route('/personalTasks');
personalTaskRoute.post(function(req, res){
  //Tasks cannot be created (or updated) without a name or a deadline.
  /*if (!req.body.name || !req.body.deadline) {
   res.status(500).json({ message: "Server error, no name or deadline", data: {} });
   }*/
  var task = new personalTask();
  task.userid = req.body.userid;
  task.courseid = req.body.courseid;
  task.description = req.body.description||"";
  task.courseName = req.body.courseName;
  task.releaseDate = req.body.releaseDate;
  task.dueDate = req.body.dueDate;

  task.save(function(err){
    if (err) {
      res.status(500).json({ message: "Server error", data: err });
    } else {
      res.status(201).json({message: "OK", data: task});
    }
  });
});

personalTaskRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});

personalTaskRoute.get(function(req, res) {
  var where = req.query.where ? JSON.parse(req.query.where) : {},
      sort = eval("("+req.query.sort+")"),
      select = req.query.select ? JSON.parse(req.query.select) : {},
      skip = req.query.skip || 0,
      limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
      count = (req.query.count === "true") || false;

  console.log("sort"+JSON.stringify(sort)+" where:"+ JSON.stringify(where));
  if (count) {
    personalTask.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, tasks) {
      if (err) {
        res.status(500).json({ message: "Server error", data: err });
      } else {
        res.status(200).json({ message: "OK", data: tasks });
      }
    });
  } else {
    console.log("not count");
    personalTask.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, tasks) {
      console.log("In execute");
      //if(tasks.length==0){
      res.status(200).json({message: "OK", data: []});
      // }else{
      if (err) {
        res.status(500).json({message: "Server error", data: err});
      } else {
        res.status(200).json({message: "OK", data: tasks});
        //   }
      }
    });
  }
});

var todoRoute = router.route('/todos');
todoRoute.post(function(req, res){
  //Tasks cannot be created (or updated) without a name or a deadline.
  /*if (!req.body.name || !req.body.deadline) {
   res.status(500).json({ message: "Server error, no name or deadline", data: {} });
   }*/
  var task = new todo();
  task.userid = req.body.userid;
  task.taskType = req.body.taskType;
  task.taskid = req.body.taskid;
  task.description = req.body.description||"";
  task.timespan = req.body.timespan||[];

  task.save(function(err){
    if (err) {
      res.status(500).json({ message: "Server error", data: err });
    } else {
      res.status(201).json({message: "OK", data: task});
    }
  });
});

todoRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});

todoRoute.get(function(req, res) {
  var where = req.query.where ? JSON.parse(req.query.where) : {},
      sort = eval("("+req.query.sort+")"),
      select = req.query.select ? JSON.parse(req.query.select) : {},
      skip = req.query.skip || 0,
      limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
      count = (req.query.count === "true") || false;

  console.log("sort"+JSON.stringify(sort)+" where:"+ JSON.stringify(where));
  if (count) {
    todo.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, tasks) {
      if (err) {
        res.status(500).json({ message: "Server error", data: err });
      } else {
        res.status(200).json({ message: "OK", data: tasks });
      }
    });
  } else {
    console.log("not count");
    todo.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, tasks) {
      console.log("In execute");
      //if(tasks.length==0){
      res.status(200).json({message: "OK", data: []});
      // }else{
      if (err) {
        res.status(500).json({message: "Server error", data: err});
      } else {
        res.status(200).json({message: "OK", data: tasks});
        //   }
      }
    });
  }
});





//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});



//Add more routes here
var userRoute = router.route('/users/:id');
userRoute.get(function(req, res) {
  User.findById(req.params.id, function(err,user){
    if(err)
      res.status(500).send(err);
    else if(user==undefined || user==null){
      res.status(404).json({ message: "User not found" });
    }else{
      res.status(200).json({message: "OK", data: user});
    }
  });
});

userRoute.delete(function(req, res) {
  User.remove({_id: req.params.id}, function(err,user){
    if(err){
      res.status(500).send({message: "Server error", data: []});
    }else if(user ==undefined||user==null||user.result.n === 0){
      res.status(404).send({message: "User not found", data: []});
    }
    else{
      res.status(200).json({message: "OK", data: [] });
    }
  });
});

userRoute.put(function(req,res){
  User.findById(req.params.id, function(err,user){
    if(err)
      res.status(500).send(err);
    else if(user==undefined || user==null){
      res.status(404).json({ message: "User not found" });
    }else{
      user.name= req.body.name;
      user.email=req.body.email;
      user.pendingTasks = req.body.pendingTasks;
      user.save(function(err) {
        if (err) {
          res.status(500).json({ message: "Server error", data: err });
        } else {
          res.status(200).json({
            data: user, message: "User has been updated!"
          });
        }
      });
    }
  });
});

var taskRoute = router.route('/tasks/:id');
taskRoute.get(function(req, res) {
  Task.findById(req.params.id, function(err,task){
    if(err)
      res.status(500).send(err);
    else if(!task ||task==undefined){
      res.status(404).json({ message: "Task not found" });
    }else{
      res.status(200).json(task);
    }
  });
});

taskRoute.delete(function(req, res) {
  Task.remove({_id: req.params.id}, function(err,task){
    if(err){
      res.status(500).send({message: "Server error", data: []});
    }else if(task ==undefined||task==null||task.result.n === 0){
      res.status(404).send({message: "Task not found", data: []});
    }
    else{
      res.status(200).json({message: "OK", data: [] });
    }
  });
});

taskRoute.put(function(req,res){
  //Tasks cannot be created (or updated) without a name or a deadline.
  if (!req.body.name || !req.body.deadline) {
    res.status(500).json({ message: "Server error, no name or deadline", data: {} });
  }else{
    Task.findById(req.params.id, function(err,task){
      if(err)
        res.status(500).send(err);
      else if(task==undefined||!task){
        res.status(404).json({ message: "Task not found" });
      }else{

        task.name= req.body.name;
        task.description=req.body.description;
        task.deadline = req.body.deadline;
        task.completed = req.body.completed;
        task.assignedUser = req.body.assignedUser;
        task.assignedUserName = req.body.assignedUserName;
        task.save(function(err) {
          if (err) {
            res.status(500).json({ message: "Server error", data: err });
          } else {
            res.status(200).json({
              data: task, message: "Task has been updated!"
            });
          }
        });
      }
    });
  }


});






// Start the server
app.listen(port);
console.log('Server running on port ' + port);
