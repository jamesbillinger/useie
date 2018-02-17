var urls = [];
var matchedURLs = [];
var connected = true;

var port = chrome.runtime.connectNative('com.jamesbillinger.useie');
port.onMessage.addListener(function(msg) {
  //console.log(msg);
  if (msg.defaultURLs && Array.isArray(msg.defaultURLs)) {
    for (var i = 0; i < msg.defaultURLs.length; i++) {
      if (urls.indexOf(msg.defaultURLs[i]) === -1) {
        urls.push(msg.defaultURLs[i]);
      }
    }
  }
});
port.onDisconnect.addListener(function() {
  console.log('disconnected');
  connected = false;
});

chrome.storage.sync.get('urls', function(ret) {
  if (ret && Array.isArray(ret.urls)) {
    urls = ret.urls;
  }
});

chrome.webNavigation && chrome.webNavigation.onCommitted.addListener(function(details) {
  //console.log(details.transitionType, details.url);
  if (['auto_subframe','about:blank'].indexOf(details.transitionType) === -1) {
    var matchedURL;
    for (var i = 0; i < urls.length; i++) {
      if (urls[i] && details.url.indexOf(urls[i]) > -1) {
        matchedURL = urls[i];
        break;
      }
    }
    if (matchedURL) {
      if (connected) {
        chrome.tabs.remove(details.tabId);
        port.postMessage(details.url);
      } else if (matchedURLs.indexOf(matchedURL) === -1) {
        console.log('unable to send message, disconnected');
        chrome.tabs[details.tabId].alert('test');
        //sendResponse({response: 'This page requires IE, but either IE or this extension are not properly installed and available'});
      }
      matchedURLs.push(matchedURL);
    }
  }
});