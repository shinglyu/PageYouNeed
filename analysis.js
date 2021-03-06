// Returns a promise
function flatten_and_sort(visits) { 
  var flat_visits = []

  for (var site of visits) {
    flat_visits = flat_visits.concat(site);
  }

  flat_visits.sort(function(x, y) { return x['visitTime'] - y['visitTime'] });

  return flat_visits;
  //return undefined;
  //return undefined;
}

function calculate_cooccurance(flat_visits, step) {
  // Assume the flat_visits is sorted
  if (flat_visits.length == 0) {
    return new SymmetricMatrix();
  }
  var start_time = flat_visits[0]["visitTime"];
  //console.log(start_time)
  var cooccurance = new Set();
  var cooccurance_matrix = new SymmetricMatrix();
  for (var visit of flat_visits) {

    //console.log(visit["visitTime"] +">=" + start_time)
    //console.log(visit["visitTime"] +"<" + (start_time+step))
    if (visit["visitTime"] >= start_time && visit["visitTime"] < start_time + step) {
      cooccurance.add(visit["url"])
    }
    else { // The array is sorted so visit["visitTime"] must > start_time + step
      // Populate the array => TODO: extract as function, maybe into SymmetricMatrix
      //console.log(cooccurance)
      //console.log(start_time)
      //console.log(start_time+step)
      //if (cooccurance.length > 1) {
      //  console.log(cooccurance)
      //}
      //else {
      //  console.log("Single item set")
      //}
      for (var key1 of cooccurance.values()) {
        for (var key2 of cooccurance.values()) {
          if (key1 < key2) {
            cooccurance_matrix.update(key1, key2, cooccurance_matrix.get(key1, key2) + 1);
          }
        }
      }

      cooccurance.clear();
      cooccurance.add(visit["url"])
      while (start_time + step <= visit["visitTime"]) {
        start_time += step; 
      }

    }
  }
  //Populate for last iteration
  for (var key1 of cooccurance.values()) {
    for (var key2 of cooccurance.values()) {
      if (key1 < key2) {
        cooccurance_matrix.update(key1, key2, cooccurance_matrix.get(key1, key2) + 1);
      }
    }
  }
  return cooccurance_matrix;
}

function suggest(cooccurance_matrix, query) {
  var result_obj = {}
  console.log("query:")
  console.log(query)
  for (var url of query) {
    var curr_row = cooccurance_matrix.get_row(url)
    //console.log(curr_row)
    // Get the union of all currently seen keys
    var keys = new Set([curr_row, result_obj].reduce((r, e) => r.concat(Object.keys(e)), []));
    for (var key of keys.values()) {
      if (key in curr_row && key in result_obj){
        result_obj[key] += curr_row[key];
      }
      else if (key in curr_row && !(key in result_obj)){
        result_obj[key] = curr_row[key];
      }
    }
  }

  for (var url of query) {
    delete result_obj[url];
  }

  var result = []
  for (var key in result_obj) {
    result.push({"url": key, "score": result_obj[key]})
  }
  result.sort(function(item1, item2){ return item1["score"] - item2["score"]}).reverse();
  return result;
}

function get_url_title_map(visits) {
  var url_to_title = {};
  for (var visit of visits) {
    url_to_title[visit.url] = visit.title;
  }
  return url_to_title
}

function combine_suggestions(suggestions) {
  var combined_suggestion_hash = {};
  for (var suggestion of suggestions) {
    // var max = Math.max(suggestion.map(s => s.score))
    // The suggestions are sorted, so the max is the first one
    if (suggestion.length == 0) {
      continue;
    }
    var max = suggestion[0]["score"]
    for (var url of suggestion) {
      if (!(url.url in combined_suggestion_hash)) {
        combined_suggestion_hash[url.url] = url.score / max;
      }
      else {
        combined_suggestion_hash[url.url] += url.score / max;
      }
    }
  }

  // This transformation is redundent, we only need this output structure if we
  // need to store more they url and score, but let keep it this way before we
  // think through it
  var combine_suggestion = [];
  for (var url in combined_suggestion_hash) {
    combine_suggestion.push({"url": url, "score": combined_suggestion_hash[url]});
  }
  return combine_suggestion;
}
