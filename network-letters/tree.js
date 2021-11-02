// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Tree(pos) {
  this.branches = [];
  this.specialBranches = []

  var pos = pos ? pos : createVector(width / 2, height / 2);
  var root = new Branch(null, pos);

  this.color = floor(random(1, 4))
  this.branches.push(root);

  this.findBranch = function () {
    this.branchSet = true
    let parent = this.branches[0]
    for (let i = 0; i < parent.children.length; i++) {
      let child = parent.children[i]
      while (child != null) {
        this.specialBranches.push(child)
        child.inSpecial = true
        child = child.child
      }
    }
  }

  this.grow = function () {
    this.finished = true
    for (var j = this.branches.length - 1; j >= 0; j--) {
      const branch = this.branches[j];
      let closestBranch = null;

      if (!branch.full) {
        let chosenLeaf = null
        let record = max_dist;

        for (const other of _quadtree.getItemsInRadius(branch.pos.x, branch.pos.y, max_dist, 100)) {
          const leaf = other;
          const d = p5.Vector.dist(leaf.pos, branch.pos);
          if (d < record && !leaf.reached) {
            closestBranch = branch
            chosenLeaf = leaf
            record = d;
          }
        }

        if (closestBranch != null) {
          this.branches.push(branch.next(chosenLeaf));
          chosenLeaf.reached = true
          this.finished = false
        } else {
          branch.full = true
        }
      }
    }
  }

  this.show = function () {
    strokeWeight(1)
    for (var i = 0; i < this.branches.length; i++) {
      const branch = this.branches[i]
      if (!branch.inSpecial) branch.show();
    }
    strokeWeight(2)
    for (var i = 0; i < this.specialBranches.length; i++) {
      const branch = this.specialBranches[i]
      branch.show();
    }
  };
}