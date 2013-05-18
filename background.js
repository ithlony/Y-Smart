// Called when the user clicks on the browser action.
localStorage.setItem("MODE", "MANUAL");
chrome.browserAction.onClicked.addListener(function(tab) {
	var mode = localStorage.getItem("MODE");
	//alert(mode);
  if (mode == null || mode == "MANUAL")
  {
  	chrome.browserAction.setIcon({path: "Y.jpg"});
  	chrome.browserAction.setTitle({title: "Auto Search: ON"});
  	localStorage.setItem("MODE", "AUTO");
  }
  else {
  	chrome.browserAction.setIcon({path: "Y2.jpg"});
  	chrome.browserAction.setTitle({title: "Auto Search: OFF"});
  	localStorage.setItem("MODE", "MANUAL");
  }
  //alert("click!");
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	
    if (request.method == "getMODE")
      sendResponse({data: localStorage.getItem("MODE")});
  });
