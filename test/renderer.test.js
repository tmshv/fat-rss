var fs = require("fs");
var Stream = require("stream");
var PassThrough = Stream.PassThrough;
var should = require("should");
var FeedParser = require("feedparser");
var Article = require("fat-article");
var parseString = require("xml2js").parseString;
var renderer = require("../lib/renderer");

const SAMPLE = fs.readFileSync("./test/sample.rss", "utf-8");

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

describe("Renderer" , function(){
	it("should accept `title`, `URL`, `author`", function(){
		var rnd = renderer("Hello LOL News", "http://hello.lol/rss", "Steve Jobs");
		rnd.title.should.be.equal("Hello LOL News");
		rnd.siteURL.should.be.equal("http://hello.lol/rss");
		rnd.author.should.be.equal("Steve Jobs");
	});

	describe("render()", function(done){
		it("should translate list of Articles to xml", function(done){
			var list = [];
			list.push(getSampleArticle());
			list.push(getSampleArticle());
			list.push(getSampleArticle());
			
			var testArticle = function(article, index){
				var source = list[index];

				article.should.be.instanceof(Article);
			}

			renderer("", "", "")
			.render(list, function(error, xml){
				parseString(xml, function(error, result){
					var xmlList = result.rss.channel[0].item;

					for(var i=0; i<list.length; i++){
						xmlList[i].title[0].should.be.equal(list[i].title);
						xmlList[i].description[0].should.be.equal(list[i].description);
						xmlList[i].guid[0]._.should.be.equal(list[i].guid);
						xmlList[i].link[0].should.be.equal(list[i].url);
					}

					done();
				});
			});
		});
	});
});