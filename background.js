function add_url_to_visits(url, data){

}
browser.history.search({
  text: "",
  startTime: 0,
  maxResults: 100
}).then(function(historyItems){
  var visits_getters = []
  for (var history of historyItems) {
    visits_getters.push(
      browser.history.getVisits({
        url: history.url
      }).then(function(visits){
        return new Promise(function(resolve, reject){
          var visits_with_url = []
          for (var visit of visits) {
            // FIXME: The history.url here is always the last iteration
            visit["url"] = history.url;
            visits_with_url.push(visit)
          }
          resolve(visits_with_url)

        })
      })
    )
    console.log(history)
  }
  return Promise.all(visits_getters)
}).then(function(results) {
  console.log(results)
})

console.log("Hi")
