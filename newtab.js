// Consider wraping this in async await
chrome.tabs.query({}, function(tabs){
  var query = tabs.map(t => t.url)
  console.log(query)
  console.log("before send")
  chrome.runtime.sendMessage({method: "get_suggestions", query: query}, function(response) {
    var ul = document.getElementById("suggestions_list");
    for (var suggestion of response.suggestions) {
      var li = document.createElement("li");
      var title = document.createElement("b");
      var link = document.createElement("a");
      title.textContent = response.titles[suggestion.url];
      link.href = suggestion.url;
      link.textContent = suggestion.url;
      li.appendChild(title);
      li.appendChild(document.createTextNode("\u00A0"));
      li.appendChild(link);
      ul.appendChild(li);
    }
  });
})
      
