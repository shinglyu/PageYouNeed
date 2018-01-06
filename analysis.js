// Returns a promise
function flatten_and_sort(visits) {
  var flat_visits = []

  for (var site of visits) {
    flat_visits = flat_visits.concat(site);
  }

  flat_visits.sort();

  return flat_visits;
  //return undefined;
  //return undefined;
}
