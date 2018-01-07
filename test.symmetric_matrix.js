describe('Symmetric matrix', function() {
  it('can be inserted', function() {
    var matrix = new SymmetricMatrix()
    matrix.update("A", "B", 5)
    expect(matrix.get("A", "B")).to.be(5);
  });
  it('is symmetric', function() {
    var matrix = new SymmetricMatrix()
    matrix.update("A", "B", 5)
    expect(matrix.get("B", "A")).to.be(5);
  });
  it('can get a row', function() {
    var matrix = new SymmetricMatrix()
    matrix.update("A", "B", 5)
    matrix.update("B", "C", 10)
    expect(matrix.get_row("B")).to.eql({"A": 5, "C": 10});
  });
  it('returns empty if trying to get a non-existant row', function() {
    var matrix = new SymmetricMatrix()
    matrix.update("A", "B", 5)
    matrix.update("B", "C", 10)
    expect(matrix.get_row("Z")).to.eql({});
  });
  it('can handle sparse data', function() {
    var matrix = new SymmetricMatrix()
    matrix.update("A", "B", 5)
    matrix.update("B", "C", 10)
    matrix.update("A", "D", 15)
    expect(matrix.get_row("B")).to.eql({"A": 5, "C": 10, "D": 0});
  });
});
