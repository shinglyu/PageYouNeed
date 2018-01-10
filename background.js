function add_url_and_title_to_visits(url, title, visits){
    var visits_with_url = []
    for (var visit of visits) {
      visit["url"] = url;
      visit["title"] = title;
      visits_with_url.push(visit)
    }
    return visits_with_url;
}

// Get all visits, with a hard-coded limit of pages
async function get_all_visits() {
  var historyItems = await browser.history.search({
    // TODO: define the start and stop time 
    text: "",
    startTime: Date.now() - (7 * 24 * 60 * 60 * 1000),
    maxResults: 5000  //TODO: Test how many can we handle
  });

  historyItems = filter_noisy_urls(historyItems);

  var visits = []
  for (var history of historyItems) {
    visits.push(
      add_url_and_title_to_visits(
        history.url, 
        history.title, 
        await browser.history.getVisits({ url: history.url })
      )
    )
  }
  return visits;
}

// main ============================================
async function main() {
  var time_step = 5 * 60 * 1000; // 5 min
  var visits = await get_all_visits();
  var sorted_visits = flatten_and_sort(visits);
  var titles = get_url_title_map(sorted_visits);
  //console.log(sorted_visits);
  for (var item of sorted_visits) {
    //console.log(item['visitTime'] + "," + item['url']);
  }
  /*
  for (var i = 0; i < 50; i++) {
    console.log(sorted_visits[i+1]['visitTime'] - sorted_visits[i]['visitTime'])
  }
  */

  // TODO: For now this will only run when extension starts
  // Force it recalculate over cetrain time and cache
  var cooccurance_matrix = calculate_cooccurance(sorted_visits, time_step);


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      //console.log("Get request ");
      if (request.method == "get_suggestions") {
        //console.log("Retrieving suggestions");
        sendResponse({ 
          suggestions: suggest(cooccurance_matrix, request.query),
          titles: titles
        });
      }
    }
  )
}

main()

