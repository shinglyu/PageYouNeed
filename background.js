function add_url_to_visits(url, visits){
    var visits_with_url = []
    for (var visit of visits) {
      visit["url"] = url;
      visits_with_url.push(visit)
    }
    return visits_with_url;
}

// Get all visits, with a hard-coded limit of pages
async function get_all_visits() {
  var historyItems = await browser.history.search({
    // TODO: define the start and stop time 
    text: "",
    startTime: 0,
    maxResults: 100  //TODO: Test how many can we handle
  })    ;
  var visits_getters = []
  for (var history of historyItems) {
    visits_getters.push(
      await add_url_to_visits(history.url, await browser.history.getVisits({
        url: history.url
      }))
      // bind trick from: https://stackoverflow.com/questions/32912459/promises-pass-additional-parameters-to-then-chain
    )
  }
  return visits_getters;
    // TODO: aggregate and sort the visits by time for further time-windowing
}

// main ============================================
async function main() {
  var time_step = 5 * 60 * 1000; // 5 min
  var visits = await get_all_visits();
  var sorted_visits = flatten_and_sort(visits);
  console.log(sorted_visits);

  // TODO: For now this will only run when extension starts
  // Force it recalculate over cetrain time and cache
  var cooccurance_matrix = calculate_cooccurance(sorted_visits, time_step);


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("Get request ");
      if (request.method == "get_suggestions") {
        console.log("Retrieving suggestions");
        sendResponse({ suggestions: suggest(cooccurance_matrix, request.query) });
      }
    }
  )
}

main()

