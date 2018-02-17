var urls = [];
var matchedURLs = [];
var connected = true;

var port = chrome.runtime.connectNative('com.jamesbillinger.useie');
port.onMessage.addListener(function(msg) {
  //console.log(msg);
  var inc = msg.defaultURLs && msg.defaultURLs.include;
  if (inc && Array.isArray(inc)) {
    for (var i = 0; i < inc.length; i++) {
      if (urls.indexOf(inc[i]) === -1) {
        urls.push(inc[i]);
      }
    }
  }
  var exc = msg.defaultURLs && msg.defaultURLs.exclude;
  if (exc && Array.isArray(exc)) {
    for (var i = 0; i < exc.length; i++) {
      let ind = urls.indexOf(exc[i]);
      if (ind > -1) {
        urls.splice(ind, 1);
      }
    }
  }
  chrome.storage.sync.set({urls});
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
        alert("This page requires IE, but either IE or this extension are not properly installed and available");
        //sendResponse({response: 'This page requires IE, but either IE or this extension are not properly installed and available'});
      }
      matchedURLs.push(matchedURL);
    }
  }
});