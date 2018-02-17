chrome.extension.sendMessage({url: location.href}, function(response) {
  if (response && response.response) {
    alert(response.response);
  }
});