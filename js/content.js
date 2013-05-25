var info = {};
var answerInfo = {};
var wikiInfo = {};
var transInfo = {};
var flickrInfo = {};

//namespace
var NS = {};
NS.url = {};
NS.url.yahooAnswerStart = "http://query.yahooapis.com/v1/public/yql?q=select * from answers.search where query=\"";
NS.url.yahooAnswerEnd = "\"and type=\"resolved\"&format=json&diagnostics=true&callback=";
//f*ck wiki json
//NS.url.wikiStart = "http://en.wikipedia.org/w/api.php?format=json&action=query&titles=";
//NS.url.wikiEnd = "&prop=revisions&rvprop=content";

NS.url.wikiStart = "http://en.wikipedia.org/wiki/";
NS.url.wikiEnd = "";

NS.url.translateAPI = "http://fanyi.youdao.com/openapi.do?keyfrom=followus&key=301801999&type=data&doctype=json&version=1.1&q=";

NS.url.FlickrStart='http://query.yahooapis.com/v1/public/yql?q=select * from flickr.photos.search where text = \"';
NS.url.FlickrEnd='\" and api_key=\"74a691a07a380f96cba0e0580664a204\" and sort=\"relevance\"&format=json&diagnostics=true';

function setBanX(){

    var resx = info.mouseupX;
    if( resx + 500 > innerWidth){
        resx = innerWidth - 400;
    }
    return resx;
}

function setBanY(){
    return info.mouseupY +  $(document).scrollTop();//NS.scrollY()
}

function showAll() {
	var allhtml = [];
	allhtml.push('<div id="box_id" style="left:', setBanX(),'px;top:', setBanY(),'px" class="box_l">');
	allhtml.push('<p>', transInfo.trans, '</p>');
	allhtml.push("<ol>");
	for(var i = 0; i < 1; i++) {
		allhtml.push('<li>' + answerInfo.json.query.results.Question[i].Subject, '</li>');
		allhtml.push('<li>' + answerInfo.json.query.results.Question[i].ChosenAnswer, '</li>');
	}				
	allhtml.push('</ol>');
	allhtml.push('<img src=', wikiInfo.img, '>');
	allhtml.push('<img src=', flickrInfo.img, '>');
	allhtml.push(wikiInfo.first_para);
	allhtml.push('</div>');
	
	
	var alldom = $(allhtml.join(''))[0];
	alldom.onmousedown = function(e) {
		e.stopPropagation();
	}
	alldom.onmouseup = function(e) {
		e.stopPropagation();
	}
	
	document.body.appendChild(alldom);
	info.dom = alldom;
}

function show2() {
	var allhtml = [];
	allhtml.push('<div id="box_id" style="left:', setBanX(),'px;top:', setBanY(),'px" class="box_l">');
	allhtml.push("<ol>");
	allhtml.push('<li id = "translate">' + "", '</li>');
	allhtml.push('<li id = "wiki">' + "</li>");
	allhtml.push('</ol>');
	allhtml.push('<img id = "flickr" src = "">');
	allhtml.push('</div>');
	
	
	var alldom = $(allhtml.join(''))[0];
	alldom.onmousedown = function(e) {
		e.stopPropagation();
	}
	alldom.onmouseup = function(e) {
		e.stopPropagation();
	}
	
	document.body.appendChild(alldom);
	info.dom = alldom;
}


function getAll() {
	show2();
	var ajaxUrl = NS.url.yahooAnswerStart + info.text
				+ NS.url.yahooAnswerEnd;
	ajaxUrl = encodeURI(ajaxUrl);
	ajaxUrl = NS.url.wikiStart + info.text
				+ NS.url.wikiEnd;
	ajaxUrl = encodeURI(ajaxUrl);
	$.get(ajaxUrl, function(html_source) {
		var first_para = $(html_source).find('p')[0].innerHTML;
		var img = "http:" + $(html_source).find("img").attr("src");
		wikiInfo.first_para = first_para;
		wikiInfo.img = img;
		$("#wiki").html(first_para);
	})
	ajaxUrl = NS.url.translateAPI + info.text;
	ajaxUrl = encodeURI(ajaxUrl);
	$.get(ajaxUrl, function(json) {
		ex = json["basic"];
		if (ex == undefined)
		ex = json["translation"];
		else
		ex = ex["explains"];
		transInfo.trans = ex;
		$("#translate").text(ex);
	})
	ajaxUrl = NS.url.FlickrStart + info.text + NS.url.FlickrEnd;
	ajaxUrl = encodeURI(ajaxUrl);
	$.get(ajaxUrl, function(json){
		var farm = json.query.results.photo[0].farm;
		var server = json.query.results.photo[0].server;
		var id = json.query.results.photo[0].id;
		var secret = json.query.results.photo[0].secret;
		var url = 'http://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'.jpg';
		flickrInfo.img = url;
		$("#flickr").attr("src", url);
		//$("#wiki").append("<img src = " + url + ">");
	})	
	//console.log("url is :" + ajaxUrl);
	/*
	$.get(ajaxUrl, function(json) {
	
		answerInfo.json = json;
		answerInfo.question_num = json.query.count;
		
	
	//get Wiki Info
		ajaxUrl = NS.url.wikiStart + info.text
				+ NS.url.wikiEnd;
		ajaxUrl = encodeURI(ajaxUrl);
		$.get(ajaxUrl, function(html_source) {
			var first_para = $(html_source).find('p')[0].innerHTML;
			var img = "http:" + $(html_source).find("img").attr("src");
			wikiInfo.first_para = first_para;
			wikiInfo.img = img;
			ajaxUrl = NS.url.translateAPI + info.text;
			ajaxUrl = encodeURI(ajaxUrl);
			$.get(ajaxUrl, function(json) {
				ex = json["basic"];
				if (ex == undefined)
					ex = json["translation"];
				else
					ex = ex["explains"];
				transInfo.trans = ex;
				ajaxUrl = NS.url.FlickrStart + info.text + NS.url.FlickrEnd;
				ajaxUrl = encodeURI(ajaxUrl);
				$.get(ajaxUrl, function(json){
					var farm = json.query.results.photo[0].farm;
					var server = json.query.results.photo[0].server;
					var id = json.query.results.photo[0].id;
					var secret = json.query.results.photo[0].secret;
					var url = 'http://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'.jpg';
					flickrInfo.img = url;
					showAll();
				})	
			})
		})
	})	
	*/
}


function selectStart(e) {
	info.mousedownX = e.clientX;
	info.mousedownY = e.clientY;
}

function selectEnd(e) {
	var text = window.getSelection().toString();
	
	if (text.length == 0 || text == info.text)
		return;
	
	if(info.dom) {
		info.dom.remove();
		info.dom = info.text = null;
	}
	
	answerInfo = {};
	wikiInfo = {};
	

	info.mouseupX = e.clientX;
	info.mouseupY = e.clientY;
	
	chrome.extension.sendMessage(
		{method: "getMODE"}, 
		function(response) 
		{
     		mode = response.data;
			//alert(mode);
     		if (mode == "AUTO")
    		{
				info.text = text;
				answerInfo = {};
				wikiInfo = {};
				getAll();  
    		}
		}
	 );
}

function keyUpD(e) {

	if (e.keyCode == 68) {
		var text = window.getSelection().toString();
		if(text == info.text){
			return;
		}
		if (info.dom) {
			info.dom.remove();
			info.dom = info.text = null;
		} 
		if (text.length == 0)
			return;
		
		info.text = text;
		answerInfo = {};
		wikiInfo = {};
		
		getAll();
	}
}

document.body.onmousedown = selectStart;
document.body.onmouseup = selectEnd;
document.body.onkeyup = keyUpD;
