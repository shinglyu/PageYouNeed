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
});
