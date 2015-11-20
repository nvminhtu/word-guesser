var express = require('express');
var bodyParser = require('body-parser');
var handleErr = require(__dirname + '/../lib/handle-err');
var basicHttp = require(__dirname + '/../lib/basic_http');
var User = require(__dirname + '/../models/userSchema');

var userRouter = module.exports = express.Router();

// create signin
userRouter.post('/signup',
    bodyParser.json(), 
    bodyParser.urlencoded({extended:true}), 
    function(req, res) {
  var user = new User();
  user.auth.basic.username = req.body.username;
  user.hashPassword(req.body.password);

  user.save(function(err, data) {
    if (err) return handleErr(err, res);

    user.generateToken(function(err, token) {
      if (err) return handleErr(err, res);
      res.json({token: token});
    });
  });
});

//FUNCTIONING ROUTE WHICH DOES NOT basicHttp or auth.
userRouter.post('/signin',
    bodyParser.json(), 
    bodyParser.urlencoded({extended:true}), 
    function(req, res) {

    User.findOne({'auth.basic.username': req.body.username}, function(err, user) {
    if (err) return res.status(401).json({msg: 'authKat seyz nope'});
    if (!user) return res.status(401).json({msg: 'kat still no'});
    if (!user.checkPassword(req.body.password)) return res.status(401).json({msg: 'uh unh'});

    user.generateToken(function(err, token) {
      if (err) return handleErr(err, res);
      res.json({token: token});
    });
  });
});

// JORDAN'S ROUTE, COULDN'T GET IT WORKING YET

// userRouter.get('/signin', basicHttp, function(req, res) {
//   // if (!(req.auth.username && req.auth.password)) return res.status(401)
//   //     .json({msg: 'authKat seyz go way'});

//   User.findOne({'auth.basic.username': req.auth.username}, function(err, user) {
//     // if (err) return res.status(401).json({msg: 'authKat seyz nope'});
//     // if (!user) return res.status(401).json({msg: 'kat still no'});
//     // if (!user.checkPassword(req.auth.password)) return res.status(401).json({msg: 'uh unh'});

//     user.generateToken(function(err, token) {
//       // if (err) return handleErr(err, res);
//       res.json({token: token});
//     });
//   });
// });


