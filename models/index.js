var mongoose = require('mongoose');
var marked = require('marked');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {type: String, enum: ['open', 'closed']},
  date:     {type: Date, default: Date.now},
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags:     {type: Array}
});

pageSchema.pre('validate', function(next) {
  var urlTitle = this.title;
  urlTitle = urlTitle.replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi,'');
  this.urlTitle = urlTitle;
  this.tags = this.tags[0].split(' ');
  next();
});

 //Creating a virtual
pageSchema.virtual('route').get(function() {
  return '/wiki/' + this.urlTitle;
});

pageSchema.virtual('tagsStr').get(function(){
  return this.tags.join(' ');
});

function generateUrlTitle(url) {
  return url.replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi,'');
}

function replacer(match, innerText) {
  return '<a href="/wiki/' + generateUrlTitle(innerText) + '">' + innerText + '</a>';
}

pageSchema.virtual('renderedContent').get(function(){
  var doubleBracketTags = /\[\[(.*?)\]\]/g;
  var rendered = this.content.replace(doubleBracketTags, replacer);
  return marked(rendered);
});

var userSchema = new mongoose.Schema({
  name: {
  	first: {type: String, required: true}, 
  	last: {type: String, required: true}
  	},
  email: {type: String, required: true, unique: true}
});

userSchema.statics.findOrCreate = function (obj) {
  var self = this;
  return self.findOne({email: obj.email}).exec()
  .then(function(user){
    if(user) return user;
    else {
       return self.create({
        name: {first: obj.first, last: obj.last},
        email: obj.email
       });
    }
  });
};

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
};