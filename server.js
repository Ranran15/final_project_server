// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Task = require('./models/task');
var User = require('./models/user');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
//digital ocean
//mongoose.connect('mongodb://localhost/mp4');
mongoose.connect('mongodb://for498web4:forever1@ds019980.mlab.com:19980/mp4')

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

var usersRoute = router.route('/users');
usersRoute.post(function(req, res){
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.pendingTasks = req.body.pendingTasks||[];
  console.log("name"+JSON.stringify(req.body.name));
  console.log("USER: " + JSON.stringify(user));

  console.log("before save");
  user.save(function(err){
    console.log("save");
    if (err) {
      res.status(500).json({ message: "Server error", data: err });
    } else {
      res.status(201).json({message: "OK", data: user});
    }
  });

  /*user.save(function(err) {
   if (err) {
   res.status(500).json({ message: "Server error", data: err });
   } else {
   res.status(200).json({message: "OK", data: user});
   }
   });*/
});

usersRoute.get(function(req, res) {
  var where = req.query.where ? JSON.parse(req.query.where) : {},
      sort = eval("("+req.query.sort+")"),
      select = req.query.select ? JSON.parse(req.query.select) : {},
      skip = req.query.skip || 0,
      limit = req.query.limit ? JSON.parse(req.query.limit) : 0,
      count = (req.query.count === "true") || false;

  console.log("sort"+JSON.stringify(sort)+" where:"+ JSON.stringify(where));
  if (count) {/*mongoose.model('User')*/
    User.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function(err, users) {
      if (err) {
        res.status(500).json({ message: "Server error", data: err });
      } else {
        res.status(200).json({ message: "OK", data: users });
      }
    });
  } else {
    console.log("not count");
    User.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, users) {
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

usersRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});



var tasksRoute = router.route('/tasks');
tasksRoute.post(function(req, res){
  //Tasks cannot be created (or updated) without a name or a deadline.
  /*if (!req.body.name || !req.body.deadline) {
   res.status(500).json({ message: "Server error, no name or deadline", data: {} });
   }*/
  var task = new Task();

  task.name = req.body.name;
  task.description = req.body.description;
  task.deadline = req.body.deadline;
  task.completed = req.body.completed;
  task.assignedUser = req.body.assignedUser;
  task.assignedUserName = req.body.assignedUserName;

  task.save(function(err){
    if(err)
      res.send(err);
    else
      res.json({message:"task added",data: task });
  });
  /*task.save(function(err){
   if(err)
   res.status(500).send(err);
   else
   res.status(200).json({message:"task added",data: task });
   });*/
});

tasksRoute.options(function(req, res){
  res.writeHead(200);
  res.end();
});

tasksRoute.get(function(req, res) {
  var sort = eval("("+req.query.sort+")");
  var where = eval("("+req.query.where+")");
  var select = eval("("+req.query.select+")");
  var skip = eval("("+req.query.skip+")");
  var limit = eval("("+req.query.limit+")");
  var count = (req.query.count === "true") || false;

  if(count){
    Task.find(where)
        .sort(sort).select(select).skip(skip).limit(limit).count()
        .exec(function(err,tasks){
          if(err)
            res.status(500).send(err);
          res.status(200).json(tasks);
        });
  }else{
    Task.find(where)
        .sort(sort).select(select).skip(skip).limit(limit)
        .exec(function(err,tasks){
          if(err)
            res.status(500).send(err);
          res.status(200).json(tasks);
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
    else if(!user){
      res.status(404).json({ message: "User not found" });
    }else{
      res.status(200).json(user);
    }
  });
});

userRoute.delete(function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err){
    if(err)
      res.status(500).send(err);
    else if(!user){
      res.status(404).json({ message: "User not found" });
    }else{
      res.status(200).json({messages:"user deleted"});
    }
  });
});

userRoute.put(function(req,res){
  User.findById(req.params.id, function(err,user){
    if(err)
      res.status(500).send(err);
    else if(!user){
      res.status(404).json({ message: "User not found" });
    }else{
      for (var property in req.body) {
        user[property] = req.body.property;
      }
      user.save(function(err) {
        if (err) {
          res.status(500).json({ message: "Server error", data: err });
        } else {
          res.status(200).json({
            data: {}, message: "User has been updated!"
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
    else if(!task){
      res.status(404).json({ message: "Task not found" });
    }else{
      res.status(200).json(task);
    }
  });
});

taskRoute.delete(function(req, res) {
  Task.findByIdAndRemove(req.params.id, function(err){
    if(err)
      res.status(500).send(err);
    else if(!task){
      res.status(404).json({ message: "Task not found" });
    }else{
      res.status(200).json({messages:"user deleted"});
    }
  });
});

taskRoute.put(function(req,res){
  //Tasks cannot be created (or updated) without a name or a deadline.
  if (!req.body.name || !req.body.deadline) {
    res.status(500).json({ message: "Server error, no name or deadline", data: {} });
  }


  Task.findById(req.params.id, function(err,task){
    if(err)
      res.status(500).send(err);
    else if(!task){
      res.status(404).json({ message: "User not found" });
    }else{
      for (var property in req.body) {
        task[property] = req.body.property;
      }
      task.save(function(err) {
        if (err) {
          res.status(500).json({ message: "Server error", data: err });
        } else {
          res.status(200).json({
            data: {}, message: "Task has been updated!"
          });
        }
      });
    }
  });
});






// Start the server
app.listen(port);
console.log('Server running on port ' + port);
