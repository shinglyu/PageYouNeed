describe('Filtering', function() {
  it('can filter out google search results', function() {
    var input = [
      {"url":"https://www.google.com/search?q=browser+history+search&ie=utf-8&oe=utf-8&client=firefox-b-ab" }, 
      {"url":"http://www.google.nl/search?q=browser+history+search&ie=utf-8&oe=utf-8&client=firefox-b-ab" }, 
      {"url":"https://www.google.com/maps/foo"},
    ]
    var expected = [
      {"url":"https://www.google.com/maps/foo"},
    ]
    var result = filter_google_search(input)
    expect(result).to.eql(expected);
  });
});
