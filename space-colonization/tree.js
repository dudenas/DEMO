// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Tree(pos) {
  this.branches = [];

  var pos = pos ? pos : createVector(width / 2, height / 2);
  var root = new Branch(null, pos);
  let finished = false
  this.branches.push(root);

  this.grow = function () {
    this.finished = true
    for (var j = this.branches.length - 1; j >= 0; j--) {
      var branch = this.branches[j];
      if (!branch.full) {
        let closestBranch = null;
        let chosenLeaf = null
        var record = max_dist;
        let idx = -1

        let total = 0;
        for (const other of _quadtree.getItemsInRadius(branch.pos.x, branch.pos.y, max_dist, Infinity)) {
          var leaf = other;
          idx = leaf.idx
          var d = p5.Vector.dist(leaf.pos, branch.pos);
          if (d < record && !leaf.reached) {
            closestBranch = branch
            chosenLeaf = idx
            record = d;
          }
        }

        if (closestBranch != null) {
          this.branches.push(branch.next(_leaves[chosenLeaf]));
          if (random(1) > params.overlap) _leaves[chosenLeaf].reached = true
          this.finished = false
        } else {
          branch.full = true
        }
      }
    }
  };

  this.show = function () {
    for (var i = 0; i < this.branches.length; i++) {
      this.branches[i].show();
    }
  };
}