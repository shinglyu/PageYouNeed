describe('Data cleaning', function() {
  it('can flatten and sort the timings', function() {
    var input = [
      [{"url":"A.com", "visitTime": 1}, {"url":"A.com", "visitTime": 3}],
      [{"url":"B.com", "visitTime": 2}],
      [{"url":"C.com", "visitTime": 4}]
    ]
    var expected = [
      {"url":"A.com", "visitTime": 1},
      {"url":"B.com", "visitTime": 2},
      {"url":"A.com", "visitTime": 3},
      {"url":"C.com", "visitTime": 4}
    ]
    var result = flatten_and_sort(input)
    expect(result).to.eql(expected);
  });
  it('can get url => title mapping', function() {
    var input = [
      {"url":"A.com", "title": "Amazing A"},
      {"url":"B.com", "title": "Bullish B"},
      {"url":"C.com", "title": "Creative C"}
    ]
    var expected = {
      "A.com": "Amazing A",
      "B.com": "Bullish B",
      "C.com": "Creative C"
    } 
    var result = get_url_title_map(input)
    expect(result).to.eql(expected);
  });
});

describe('Recommender', function() {
  it('can accept empty input', function() {
    var cooccurance_matrix = calculate_cooccurance([], 1)
    // Smoke test
  });
  it('can be populated', function() {
    var input = [
      {"url":"A.com", "visitTime": 1},
      {"url":"B.com", "visitTime": 2},
      {"url":"A.com", "visitTime": 3},
      {"url":"C.com", "visitTime": 4},
      {"url":"B.com", "visitTime": 4}
    ]
    var step = 2; //[1,3), [3,5)
    var expected = [
      {"key1":"A.com", "key2": "B.com", "value": 2},
      {"key1":"A.com", "key2": "C.com", "value": 1},
      {"key1":"B.com", "key2": "C.com", "value": 1},
      {"key1":"A.com", "key2": "A.com", "value": 0}
    ]
    var cooccurance_matrix = calculate_cooccurance(input, step)
    for (var testcase of expected) {
      expect(cooccurance_matrix.get(testcase["key1"], testcase["key2"])).to.be(testcase["value"])
    }
  });
  it('can handle big time gap', function() {
    var input = [
      {"url":"A.com", "visitTime": 1},
      {"url":"B.com", "visitTime": 2},
      {"url":"A.com", "visitTime": 997},
      {"url":"C.com", "visitTime": 998},
      {"url":"B.com", "visitTime": 998}
    ]
    var step = 2; //[1,3), [3,5)
    var expected = [
      {"key1":"A.com", "key2": "B.com", "value": 2},
      {"key1":"A.com", "key2": "C.com", "value": 1},
      {"key1":"B.com", "key2": "C.com", "value": 1},
      {"key1":"A.com", "key2": "A.com", "value": 0}
    ]
    var cooccurance_matrix = calculate_cooccurance(input, step)
    for (var testcase of expected) {
      expect(cooccurance_matrix.get(testcase["key1"], testcase["key2"])).to.be(testcase["value"])
    }
  });
  it('can suggest for one page', function() {
    var inputs = [
      {"key1":"A.com", "key2": "B.com", "value": 1},
      {"key1":"A.com", "key2": "C.com", "value": 2},
    ]
    var cooccurance_matrix = new SymmetricMatrix();
    for (var input of inputs) {
      cooccurance_matrix.update(input["key1"], input["key2"], input["value"]);
    }
    expect(suggest(cooccurance_matrix, ["A.com"])).to.eql([
      // Sort by score
      {"url": "C.com", "score": 2},
      {"url": "B.com", "score": 1}
    ])
  });
  it('can suggest for multiple page', function() {
    var inputs = [
      {"key1":"A.com", "key2": "B.com", "value": 1},
      {"key1":"A.com", "key2": "C.com", "value": 2},
      {"key1":"B.com", "key2": "C.com", "value": 3},
      {"key1":"A.com", "key2": "D.com", "value": 8},
    ]
    var cooccurance_matrix = new SymmetricMatrix();
    for (var input of inputs) {
      cooccurance_matrix.update(input["key1"], input["key2"], input["value"]);
    }
    expect(suggest(cooccurance_matrix, ["A.com", "B.com"])).to.eql([
      // Sort by score
      {"url": "D.com", "score": 8},
      {"url": "C.com", "score": 5}
    ])
  });
  it('can ignore not-seen page', function() {
    // Same setup as previous test, consider extracting it
    var inputs = [
      {"key1":"A.com", "key2": "B.com", "value": 1},
      {"key1":"A.com", "key2": "C.com", "value": 2},
      {"key1":"B.com", "key2": "C.com", "value": 3},
      {"key1":"A.com", "key2": "D.com", "value": 8},
    ]
    var cooccurance_matrix = new SymmetricMatrix();
    for (var input of inputs) {
      cooccurance_matrix.update(input["key1"], input["key2"], input["value"]);
    }
    expect(suggest(cooccurance_matrix, ["A.com", "B.com", "Z.com"])).to.eql([
      // Sort by score
      {"url": "D.com", "score": 8},
      {"url": "C.com", "score": 5}
    ])
  });
  it('real timestamp input', function() {
    var input = [
      {"url": "habitat", "visitTime":1515099986672},
      {"url": "habitat", "visitTime":1515099987183},
      {"url": "github", "visitTime":1515100005173},
      {"url": "github", "visitTime":1515100038849},
      {"url": "github", "visitTime":1515100041584},
      {"url": "github", "visitTime":1515100046676},
      {"url": "github", "visitTime":1515100050010},
      {"url": "github", "visitTime":1515100051412},
      {"url": "github", "visitTime":1515100055882},
      {"url": "github", "visitTime":1515100066936},
      {"url": "habitat", "visitTime":1515100069580},
      {"url": "habitat", "visitTime":1515100092312},
      {"url": "foo", "visitTime":1515100092356},
      {"url": "habitat", "visitTime":1515100092548},
      {"url": "habitat", "visitTime":1515100104024},
      {"url": "google", "visitTime":1515100115127},
      {"url": "google", "visitTime":1515100115482},
      {"url": "google", "visitTime":1515100121175}
    ]
    var step = 60*1000; //[1,3), [3,5)
    var expected = [
      {"key1":"habitat", "key2": "github", "value": 2},
      {"key1":"habitat", "key2": "google", "value": 0},
      {"key1":"habitat", "key2": "foo", "value": 1},
    ]
    var cooccurance_matrix = calculate_cooccurance(input, step)
    for (var testcase of expected) {
      expect(cooccurance_matrix.get(testcase["key1"], testcase["key2"])).to.be(testcase["value"])
    }
  });
});

describe('Suggestion combination', function() {
  it('can normalize the combine scores', function() {
    var input = [
      [{"url": "A", "score": 100}, {"url": "B", "score": 50}],
      [{"url": "B", "score":  10}, {"url": "C", "score":  3}]
    ]
    var expected = [
      {"url": "A", "score": 1.0}, 
      {"url": "B", "score": 1.5},
      {"url": "C", "score": 0.3}, 
    ]

    expect(combine_suggestions(input)).to.eql(expected);
  });
  it('can combine empty suggestions', function() {
    var input = [
      [],
      [{"url": "B", "score":  10}, {"url": "C", "score":  3}]
    ]
    var expected = [
      {"url": "B", "score": 1.0},
      {"url": "C", "score": 0.3}, 
    ]

    expect(combine_suggestions(input)).to.eql(expected);
  });
});
