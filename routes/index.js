var express = require('express');
var router = express.Router();
var Page = require('../models/index.js').Page;
var User = require('../models/index.js').User;

/* GET home page. */
router.get('/', function(req, res, next) {
  Page.find()
  .then(function(pages){
  	console.log(pages);	
  	res.render('index', {pages: pages});
  });
});

module.exports = router;
