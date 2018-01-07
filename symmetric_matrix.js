class SymmetricMatrix {
  constructor() {
    this.matrix = {}
  }
  update(key1, key2, value) {
    var [small_key, large_key] = key1 < key2 ? [key1, key2] : [key2, key1]
    if (! (small_key in this.matrix)) {
      this.matrix[small_key] = {}
    }
    if (! (large_key in this.matrix)) {
      this.matrix[large_key] = {}
    }
    this.matrix[small_key][large_key] = value 
  }
  get(key1, key2){
    var [small_key, large_key] = key1 < key2 ? [key1, key2] : [key2, key1]
    if (! (small_key in this.matrix) || ! (large_key in this.matrix[small_key])) {
      return 0
    }
    else {
      return this.matrix[small_key][large_key]
    }
  }
  get_row(key){
    if (! (key in this.matrix)) {
      console.warn("Row " + key + " not found in the matrix")
      return {}
    }
    var row = this.matrix[key]; // incomplete set of values, this might speedup the for loop
    for (var other_key of Object.keys(this.matrix)) {
      if (! (other_key in row) && other_key != key) {
        row[other_key] = this.get(key, other_key)
      }
    }
    return row;
  }
}
