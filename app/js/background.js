function onNativeMessage(message) {
  console.log(message);
}

function onDisconnected() {
  console.log('disconnected');
}

var hostName = "com.haysmed.useie";
var port = chrome.runtime.connectNative(hostName);
port.onMessage.addListener(onNativeMessage);
port.onDisconnect.addListener(onDisconnected);

var urls = [];
chrome.storage.sync.get('urls', function(response) {
  urls = response || [];
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.url) {
    var send = false;
    for (var i = 0; i < urls.length; i++) {
      var u = urls[i];
      if (u && request.url.indexOf(u) > -1) {
        send = true;
        break;
      }
    }
    if (send) {
      chrome.tabs.remove(sender.tab.id);
      var message = request.url;
      port.postMessage(message);
    }
  }
  //chrome.tabs.update(sender.tab.id, {url: request.redirect});
  //sendResponse();
});