var should = require("should");
var fat = require("fat");
var Article = require("fat-article");
var parseString = require("xml2js").parseString;
var rss = require("../");


function getSampleArticle () {
	var a = {
		title: "Sample article",
		description: "This field contains sample description",
		url: "http://sample.com/feed/sample-post",
		guid: "http://sample.com/feed/sample-post",
		categories: ["sample", "interesting"],
		author: "Sample Writer",
		date: new Date(2001, 8, 9)
	};
	for(var i=0; i<2000; i++){
		a.description += Math.random().toString();
	}
	return a;
}

describe("rss", function(){
	it("should translate list of Articles to xml rss data", function(done){
		var list = [];
		list.push(Article.create(getSampleArticle()));
		list.push(Article.create(getSampleArticle()));
		list.push(Article.create(getSampleArticle()));
		list.push(Article.create(getSampleArticle()));
		list.push(Article.create(getSampleArticle()));

		fat.reset();
		fat.receipt(function(data, next){
			for(var i=0; i<list.length; i++){
				this.collect(list[i]);
			}
			next();
		})
		.receipt(rss("Hellolol News", "http://Hellolol.org", "Steve Jobs"))
		.end(function(){
			parseString(this.product, function(error, result){
				var xmlList = result.rss.channel[0].item;

				for(var i=0; i<list.length; i++){
					xmlList[i].title[0].should.be.equal(list[i].title);
					xmlList[i].description[0].should.be.equal(list[i].description);
				}

				done();
			});
		})
	});
});