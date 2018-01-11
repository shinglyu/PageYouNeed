describe('Time of day counts', function() {
  it('can be populated and searched', function() {
    var input = [
      {"url":"A.com", "visitTime": Date.parse("2018-01-01T00:12:00")}, // Monday
      {"url":"A.com", "visitTime": Date.parse("2018-01-01T00:13:00")},
      {"url":"A.com", "visitTime": Date.parse("2018-01-01T00:14:00")},
      {"url":"B.com", "visitTime": Date.parse("2018-01-01T00:15:00")},
      {"url":"B.com", "visitTime": Date.parse("2018-01-01T02:14:00")},
      {"url":"C.com", "visitTime": Date.parse("2018-01-01T03:14:00")},
    ]
    var time_counts = new TimeOfDayCounts(input);
    expect(time_counts.get(Date.parse("2018-01-01T00:00:00"))).to.eql({"A.com": 3, "B.com": 1});
    expect(time_counts.get(Date.parse("2018-01-01T02:00:00"))).to.eql({"B.com": 1});
  });
  it('can produce suggestion format output', function() {
    var input = [
      {"url":"B.com", "visitTime": Date.parse("2018-01-01T00:15:00")},
      {"url":"A.com", "visitTime": Date.parse("2018-01-01T00:12:00")}, // Monday
      {"url":"A.com", "visitTime": Date.parse("2018-01-01T00:13:00")},
      {"url":"A.com", "visitTime": Date.parse("2018-01-01T00:14:00")},
      {"url":"B.com", "visitTime": Date.parse("2018-01-01T02:14:00")},
      {"url":"C.com", "visitTime": Date.parse("2018-01-01T03:14:00")},
    ]
    var time_counts = new TimeOfDayCounts(input);
    expect(time_counts.suggest(Date.parse("2018-01-01T00:00:00"))).to.eql([
      // Sort by score
      {"url": "A.com", "score": 3},
      {"url": "B.com", "score": 1}
    ]);
  });
});

