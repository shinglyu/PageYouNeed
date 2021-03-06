describe('Filtering', function() {
  it('can filter out google search results', function() {
    var input = [
      {"url":"https://www.google.com/search?q=browser+history+search&ie=utf-8&oe=utf-8&client=firefox-b-ab"}, 
      {"url":"http://www.google.nl/search?q=browser+history+search&ie=utf-8&oe=utf-8&client=firefox-b-ab"}, 
      {"url":"https://www.google.com/maps/foo"},
    ]
    var expected = [
      {"url":"https://www.google.com/maps/foo"},
    ]
    var result = filter_google_search(input)
    expect(result).to.eql(expected);
  });
  it('can filter out http to https redirection', function() {
    var input = [
      {"url":"https://www.test.com" }, 
      {"url":"http://www.test.com" }, 
      {"url":"http://www.test2.com" }, 
      {"url":"https://www.test2.com" }, 
    ]
    var expected = [
      {"url":"https://www.test.com"},
      {"url":"https://www.test2.com"},
    ]
    var result = filter_http_to_https(input)
    expect(result).to.eql(expected);
  });
  it('can filter out feedly item url', function() {
    var input = [
      {"url":"https://feedly.com/i/entry/VF72X7MyzXC9jZseEj/KwuqlRloviDncQiaJM5pE+nA=_160dc0ab055:50bd64:6e7207bb" }, 
    ]
    var expected = []
    var result = filter_feedly_item(input)
    expect(result).to.eql(expected);
  });
});
