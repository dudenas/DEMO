// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Tree(pos) {
  this.branches = [];

  var pos = pos ? pos : createVector(width / 2, height / 2);
  var root = new Branch(null, pos);
  this.branches.push(root);

  this.grow = function () {
    for (var j = this.branches.length - 1; j >= 0; j--) {
      var branch = this.branches[j];
      let closestBranch = null;
      let chosenLeaf = null
      var record = max_dist;
      let idx = -1

      let total = 0;
      for (const other of _quadtree.getItemsInRadius(branch.pos.x, branch.pos.y, max_dist, 10)) {
        var leaf = other;
        idx = leaf.idx
        var d = p5.Vector.dist(leaf.pos, branch.pos);
        if (d < record && !leaf.reached) {
          closestBranch = branch
          chosenLeaf = idx
          record = d;
        }
      }
      // for (var i = 0; i < _leaves.length; i++) {
      //   var leaf = _leaves[i];
      //   var d = p5.Vector.dist(leaf.pos, branch.pos);
      //   if (d < record) {
      //     closestBranch = branch;
      //     chosenLeaf = i
      //     record = d;
      //   }
      // }

      if (closestBranch != null) {
        this.branches.push(branch.next(_leaves[chosenLeaf]));
        // if (random(1) > 0.5)
        // _leaves.splice(chosenLeaf, 1);
        _leaves[chosenLeaf].reached = true
        // }
      }
    }
  };

  this.show = function () {
    for (var i = 0; i < this.branches.length; i++) {
      this.branches[i].show();
    }
  };
}