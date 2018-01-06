chrome.runtime.sendMessage({method: "get_suggestions"}, function(response) {
  console.log(response.suggestions);
});
      
