var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var Page = require('mongoose').model('Page');
var Promise = require('bluebird');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().exec()
  .then(function(users){
  	console.log(users[0]._id);
  	res.render('users', {users: users});
  });
});

router.get('/:id', function(req, res, next) {
  var usersPromise = User.findOne({_id: req.params.id});
  var pagesPromise = Page.find({author: req.params.id});
  Promise.join(usersPromise, pagesPromise, function(user, pages){
  	res.render('user', {user: user, pages: pages});
  })
  .catch(next);
});

router.post('/', function(req, res, next) {
  res.send('create user');
});

router.put('/:id', function(req, res, next) {
  res.send('update user');
});

router.delete('/:id', function(req, res, next) {
  res.send('delete user');
});

module.exports = router;
