localStorage.setItem("MODE", "MANUAL");
chrome.browserAction.onClicked.addListener(function(tab) {
	var mode = localStorage.getItem("MODE");
	//alert(mode);
  if (mode == null || mode == "MANUAL")
  	localStorage.setItem("MODE", "AUTO");
  else 
  	localStorage.setItem("MODE", "MANUAL");
  //alert("click!");
});
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	
    if (request.method == "getMODE")
      sendResponse({data: localStorage.getItem("MODE")});
  });