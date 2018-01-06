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
