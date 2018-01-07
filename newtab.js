// Consider wraping this in async await
chrome.tabs.query({}, function(tabs){
  var query = tabs.map(t => t.url)
  console.log(query)
  console.log("before send")
  chrome.runtime.sendMessage({method: "get_suggestions", query: query}, function(response) {
    var ul = document.getElementById("suggestions_list");
    for (var suggestion of response.suggestions) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.href = suggestion.url;
      link.innerText = suggestion.url;
      li.appendChild(link);
      ul.appendChild(li);
    }
  });
})
      
