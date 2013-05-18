var selectionTextInfo = {};
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

    var resx = selectionTextInfo.mouseupX;
    if( resx + 500 > innerWidth){
        resx = innerWidth - 400;
    }
    return resx;
}
function setBanY(){
    return selectionTextInfo.mouseupY +  $(document).scrollTop();//NS.scrollY()
}

function getAnswer() {
	var ajaxUrl = NS.url.yahooAnswerStart + selectionTextInfo.text
				+ NS.url.yahooAnswerEnd;
	ajaxUrl = encodeURI(ajaxUrl);
	//console.log("url is :" + ajaxUrl);
	$.get(ajaxUrl, function(json) {
	//	console.log("in get Answer:" + json);
		answerInfo.json = json;
		//console.log("before show question");
		if (json.query.count > 0) {
			showQuestion();
		}
	})	
}

function showQuestion() {
	var answerhtml = [];
	console.log(answerInfo);
	console.log("output answer: " + answerInfo);
	answerhtml.push('<div id="box_id" style="left:', setBanX(),'px;top:', setBanY(),'px" class="box_l">');
	answerhtml.push("<ol>");
	for(var i = 0; i < 1; i++) {
		answerhtml.push('<li>' + answerInfo.json.query.results.Question[i].Subject, '</li>');
		answerhtml.push('<li>' + answerInfo.json.query.results.Question[i].ChosenAnswer, '</li>');
	}				
	answerhtml.push('</ol>', '</div>');
	var answerdom = $(answerhtml.join(''))[0];
	answerdom.onmousedown = function(e) {
		e.stopPropagation();
	}
	answerdom.onmouseup = function(e) {
		e.stopPropagation();
	}
	
	document.body.appendChild(answerdom);
	selectionTextInfo.dom = answerdom;
}

function getWiki() {
	var ajaxUrl = NS.url.wikiStart + selectionTextInfo.text
				+ NS.url.wikiEnd;
	ajaxUrl = encodeURI(ajaxUrl);
	$.get(ajaxUrl, function(html_source) {
		var first_para = $(html_source).find('p')[0].innerHTML;
		var img = "http:" + $(html_source).find("img").attr("src");
		wikiInfo.first_para = first_para;
		wikiInfo.img = img;
		showWiki();
	})
}

function getAll() {
	//get Yahoo Answer
	var ajaxUrl = NS.url.yahooAnswerStart + selectionTextInfo.text
				+ NS.url.yahooAnswerEnd;
	ajaxUrl = encodeURI(ajaxUrl);
	//console.log("url is :" + ajaxUrl);
	$.get(ajaxUrl, function(json) {
	
		answerInfo.json = json;
		answerInfo.question_num = json.query.count;
		
	
	//get Wiki Info
		ajaxUrl = NS.url.wikiStart + selectionTextInfo.text
				+ NS.url.wikiEnd;
		ajaxUrl = encodeURI(ajaxUrl);
		$.get(ajaxUrl, function(html_source) {
			var first_para = $(html_source).find('p')[0].innerHTML;
			var img = "http:" + $(html_source).find("img").attr("src");
			wikiInfo.first_para = first_para;
			wikiInfo.img = img;
			ajaxUrl = NS.url.translateAPI + selectionTextInfo.text;
			ajaxUrl = encodeURI(ajaxUrl);
			$.get(ajaxUrl, function(json) {
				ex = json["basic"];
				if (ex == undefined)
					ex = json["translation"];
				else
					ex = ex["explains"];
				transInfo.trans = ex;
				ajaxUrl = NS.url.FlickrStart + selectionTextInfo.text + NS.url.FlickrEnd;
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
}

function showWiki() {
	var wikihtml = [];
	//console.log("output wiki: " + wikiInfo);
	wikihtml.push
	wikihtml.push('<div id="box_id" style="left:', setBanX(),'px;top:', setBanY(),'px" class="box_l">');
	wikihtml.push('<img src=', wikiInfo.img, '>');
	wikihtml.push(wikiInfo.first_para);
	wikihtml.push('</div>');
	var wikidom = $(wikihtml.join(''))[0];
	wikidom.onmousedown = function(e) {
		e.stopPropagation();
	}
	wikidom.onmouseup = function(e) {
		e.stopPropagation();
	}
	
	$('body').append(wikidom);
	
	//document.body.appendChild(wikidom);
	selectionTextInfo.dom = wikidom;
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
	selectionTextInfo.dom = alldom;
}



//响应鼠标按下事件，记录鼠标按下的坐标
function selectStart(e) {
	selectionTextInfo.mousedownX = e.clientX;
	selectionTextInfo.mousedownY = e.clientY;
}

function selectEnd(e) {
	var text = window.getSelection();
	var selectionText = text.toString();
	
	//要是这次选中的和上次选中的相同，就不处理，
	//直接调用内存的信息显示就OK
	if (selectionText.length == 0)
		return;
	if (selectionText == selectionTextInfo.text) {
		return;
	}
	
	//以下是处理没有重复的情况
	if(selectionTextInfo.dom) {
		selectionTextInfo.dom.remove();
		selectionTextInfo.dom = selectionTextInfo.text = null;
	}
	
	//初始化所有变量
	answerInfo = {};
	wikiInfo = {};
	

	selectionTextInfo.mouseupX = e.clientX;
	selectionTextInfo.mouseupY = e.clientY;
	
	chrome.extension.sendMessage({method: "getMODE"}, function(response) {
			
     		mode = response.data;
			//alert(mode);
     		if (mode == "AUTO")
    		{
				selectionTextInfo.text = selectionText;
				answerInfo = {};
				wikiInfo = {};
				getAll();  
    		}
     });
}

function keyUpD(e) {

	if (e.keyCode == 68) {
		var text = window.getSelection();
		var selectionText = text.toString();
		if (selectionTextInfo.dom) {
			selectionTextInfo.dom.remove();
			selectionTextInfo.dom = selectionTextInfo.text = null;
		} else {
			if(selectionText == selectionTextInfo.text){
				return;
			}
		}
		
		selectionTextInfo.text = selectionText;
		answerInfo = {};
		wikiInfo = {};
		
		getAll();
	}
}

document.body.onmousedown = selectStart;
document.body.onmouseup = selectEnd;
document.body.onkeyup = keyUpD;