module.exports = function(swig) {
    function pageLink(page) {
        return '<a href="' + page.route + '">' + page.title + '</a>';
    }
    pageLink.safe = true;

    swig.setFilter('pageLink', pageLink);

    function getUserId(user) {
    	return '/user/' + JSON.stringify(user._id);	
    }
    getUserId.safe = true;
    swig.setFilter('getUserId', getUserId);
};

