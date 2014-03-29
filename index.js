var Article = require("fat-article");
var Receipt = require("fat").Receipt;
var renderer = require("./lib/renderer");

module.exports = function(title, url, author){
	var collapse = new Receipt();
	collapse.wrap(function(data){
		if(data instanceof Article){
			return data;
		}
	})
	.on("end", function(){
		var list = this.result;
		this.override([list]);
	});

	var render = new Receipt();
	render.wrap(function(list, next){
		renderer(title, url, author)
		.render(list, function(error, xml){
			if(error){
				next();
			}else{
				next(xml);
			}
		})
	});

	return [collapse, render];
}