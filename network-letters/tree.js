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

  this.branchesColors = []
  this.branchesWeight = []

  this.findBranch = function () {
    this.branchSet = true
    let idx = 0
    for (let n = 0; n < this.branches.length; n++) {
      let parent = this.branches[n]
      if (!parent.inSpecial) {
        this.specialBranches.push([])
        for (let i = 0; i < parent.children.length; i++) {
          let child = parent.children[i]
          while (child != null) {
            this.specialBranches[idx].push(child)
            child.inSpecial = true
            child = child.child
          }
        }
        if (this.specialBranches[idx].length == 0) this.specialBranches.splice(idx, 1)
        else idx++
      }
    }

    // add Each color for a branch
    for (let i = 0; i < this.specialBranches.length; i++) {
      this.branchesColors.push(floor(random(1, 4)))
      this.branchesWeight.push(random(1) < 0.2)
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

    for (let n = 0; n < this.specialBranches.length; n++) {
      const col = this.branchesColors[n]
      strokeWeight(this.branchesWeight[n] ? 2 : 1)
      if (params.colorMode == 0) stroke(_clrs[col])
      const currBranch = this.specialBranches[n]
      for (var i = 0; i < currBranch.length; i++) {
        const branch = currBranch[i]
        branch.show();
      }
    }
    // console.log(this.specialBranches[0])
    // for (var i = 0; i < this.specialBranches[0].length; i++) {
    //   const branch = this.specialBranches[0][i]
    //   branch.show();
    // }
  };
}