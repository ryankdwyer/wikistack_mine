var express = require('express');
var Page = require('../models/index.js').Page;
var User = require('../models/index.js').User;

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('got to wiki/');
    res.redirect('/');

});

router.post('/', function(req, res, next) {
	User.findOrCreate(req.body)
		.then(function(user){
		    return new Page({
		    	title:req.body.title,
		    	content:req.body.content,
		    	author: user.id,
		    	tags: req.body.tags
		    }).save();
		})
		.then(function(page){
			res.redirect(page.route);
		});
});

router.get('/add', function(req, res, next) {
    //res.send('got to wiki/add/');
    res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next){
	Page
	.findOne({urlTitle: req.params.urlTitle})
	.populate('author')
	.then(function(page){
		if (page) {
			console.log(page.tags);
			res.render('wikipage', page);
		} else {
			var error = {
				message: 'Page not found.'
			};
			res.status(404).render('error', error);
		}
	});
});

router.get('/:urlTitle/edit', function(req, res, err){
	Page
	.findOne({urlTitle: req.params.urlTitle})
	.then(function(page){
		res.render('edit', page);
	});
});

router.post('/:urlTitle/edit', function(req, res, next){
	// This is required as mongo does not support pre update hooks
	req.body.tags = req.body.tags.split(' ');
	Page.update({title: req.body.title}, {content: req.body.content, tags: req.body.tags})
	.then(function(){
		res.redirect('/wiki/' + req.params.urlTitle);	
	})
	.catch(next);
});

router.get('/:urlTitle/delete', function(req, res, next) {	
		Page.remove({title: req.body.title})
		.then(function(){
			res.redirect('/');
		});
});

module.exports = router;
