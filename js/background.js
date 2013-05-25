localStorage.setItem("MODE", "MANUAL");
chrome.browserAction.onClicked.addListener(
	function(tab) {
		var mode = localStorage.getItem("MODE");
		if (mode == null || mode == "MANUAL")
		{
			localStorage.setItem("MODE", "AUTO");
			chrome.browserAction.setTitle({title: "Auto"});
			chrome.browserAction.setIcon({path: "icon/auto.jpg"});
		}
		else {
			localStorage.setItem("MODE", "MANUAL");
			chrome.browserAction.setTitle({title: "Manual"});
			chrome.browserAction.setIcon({path: "icon/manual.jpg"});
		}
	}
);
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	
    if (request.method == "getMODE")
      sendResponse({data: localStorage.getItem("MODE")});
  });
