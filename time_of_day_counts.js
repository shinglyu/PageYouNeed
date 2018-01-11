class TimeOfDayCounts {
  constructor(histories) {
    this.counts = {};
    for (var hour = 0; hour <= 23; hour += 1 ) {
      this.counts[hour] = {};
    }
    for (var history of histories){
      var hour = (new Date(history.visitTime)).getHours()
      if (!(history.url in this.counts[hour])) {
        this.counts[hour][history.url] = 1;
      }
      else {
        this.counts[hour][history.url] += 1
      }
    }
  }

  get(time) {
    var hour = (new Date(time)).getHours();
    return this.counts[hour];
  }

  suggest(time) {
    var counts_obj = this.get(time);
    var counts = [];
    for (var url in counts_obj) {
      counts.push({"url": url, "score": counts_obj[url]});
    }
    counts.sort((x, y) => x.score - y.score ).reverse();
    return counts;
  }
}
