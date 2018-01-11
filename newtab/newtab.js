// Consider wraping this in async await
chrome.tabs.query({}, function(tabs){
  var query = tabs.map(t => t.url)
  console.log(query)
  console.log("before send")
  chrome.runtime.sendMessage({method: "get_suggestions", query: query}, function(response) {
    var ul = document.getElementById("suggestions_list");
    var lines = 0;
    const max_lines = 200;
    for (var suggestion of response.suggestions) {
      if (lines > max_lines) { break; }
      var li = document.createElement("li");
      var title = document.createElement("b");
      var link = document.createElement("a");
      title.textContent = response.titles[suggestion.url] ? response.titles[suggestion.url] : "(No title)";
      link.href = suggestion.url;
      link.textContent = suggestion.url;
      li.appendChild(title);
      li.appendChild(document.createTextNode("\u00A0"));
      li.appendChild(link);
      ul.appendChild(li);

      lines += 1;
    }
  });
})
      
var g_debouce_timer = undefined;
const debounce_time = 500;

document.getElementById("search").addEventListener("input", function(event){
  var query = event.target.value;
  window.clearTimeout(g_debouce_timer);
  g_debouce_timer = window.setTimeout(function(){
    console.log("Search")
    var lis = document.getElementsByTagName("li");
    for (var li of lis) {
      if (!li.textContent.toLowerCase().includes(query.toLowerCase())) {
        li.classList.add("hidden");
      }
      else {
        li.classList.remove("hidden");
      }
    }
  }, debounce_time);
});

