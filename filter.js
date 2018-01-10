function filter_noisy_urls(histories) {
  histories = filter_google_search(histories);
  return histories

}

function filter_google_search(histories) {
  return histories.filter(history => !history.url.match(/^http(s?):\/\/www.google.\w*\/search/))
}
