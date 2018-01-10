function filter_noisy_urls(histories) {
  histories = filter_google_search(histories);
  histories = filter_http_to_https(histories);
  histories = filter_feedly_item(histories);
  return histories

}

function filter_google_search(histories) {
  return histories.filter(history => !history.url.match(/^http(s?):\/\/www.google.\w*\/search/))
}

function filter_http_to_https(histories) {
  var seen = new Set();
  for (var history of histories) {
    var url = history.url;
    if (url.startsWith("http://") && seen.has(url.replace("http", "https"))) {
      continue; // Skip
    }
    else if (url.startsWith("https://") && seen.has(url.replace("https", "http"))) {
      seen.delete(url.replace("https", "http"));
    }
    seen.add(url);
  }
  return histories.filter(history => seen.has(history.url));
}

function filter_feedly_item(histories) {
  return histories.filter(history => !history.url.match(/^http(s?):\/\/feedly.com\/i\/entry/))
}
