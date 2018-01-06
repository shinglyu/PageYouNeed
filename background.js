function add_url_to_visits(url, visits){
  return new Promise(function(resolve, reject){
    var visits_with_url = []
    for (var visit of visits) {
      visit["url"] = url;
      visits_with_url.push(visit)
    }
    resolve(visits_with_url)

  })
}

// Get all visits, with a hard-coded limit of pages
function get_all_visits() {
  return browser.history.search({
    // TODO: define the start and stop time 
    text: "",
    startTime: 0,
    maxResults: 100  //TODO: Test how many can we handle
  }).then(function(historyItems){
    var visits_getters = []
    for (var history of historyItems) {
      visits_getters.push(
        browser.history.getVisits({
          url: history.url
        }).then(add_url_to_visits.bind(null, history.url))
        // bind trick from: https://stackoverflow.com/questions/32912459/promises-pass-additional-parameters-to-then-chain
      )
    }
    return Promise.all(visits_getters)
  }).then(function(results) {
    return results
    // TODO: aggregate and sort the visits by time for further time-windowing
  })
}

// main ============================================
get_all_visits().then(function(visits) {
  console.log(visits)
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Get request ");
    if (request.method == "get_suggestions") {
      console.log("Retrieving suggestions");
      // TODO: get suggestion
      sendResponse({ suggestions: ["FOO"] });
    }
  }
)
