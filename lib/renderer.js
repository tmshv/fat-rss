var RSS = require("rss");
var Article = require("fat-article");

/**
 * Module FeedRenderer describes feed > XML compiling process
 * @param {String} title  Title of feed like «Steve Jobs feed»
 * @param {String} url    RSS feed URL
 * @param {String} author Name of feed author like «Steve Jobs»
 */
function FeedRenderer(title, url, author){
	this.title = title;
	this.siteURL = url;
	this.author = author;
}

FeedRenderer.prototype = {
	generatorName: "fat.js",
	indent: true,
	cdata: false
};

FeedRenderer.prototype.render = function(articlesList, cb){
	var feed = new RSS({
		title: this.title,
		feed_url: this.siteURL,
		site_url: this.siteURL,
		author: this.author,
		description: "",
		generator: this.generatorName
	});
	feed.cdata = this.cdata;

	articlesList.forEach(function(a){
		feed.item(a);
	});

	var xml = feed.xml(this.indent);
	cb(null, xml);
}

module.exports = function(title, url, author){
	return new FeedRenderer(title, url, author);
}