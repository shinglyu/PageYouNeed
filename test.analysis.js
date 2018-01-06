describe('Data cleaning', function() {
  it('can flatten and sort the timings', function(done) {
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
    var promise = Promise.resolve(input)
    promise.then(flatten_and_sort).then(function(result){
      console.log(result)
      expect(result).to.equal("foo");
    }).then(done, done)
  });
});
