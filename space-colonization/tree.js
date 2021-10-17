// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Tree() {
  this.leaves = [];
  this.branches = [];

  var pos = createVector(width / 2, height / 2);
  var root = new Branch(null, pos);
  this.branches.push(root);

  this.grow = function () {
    for (var j = this.branches.length - 1; j >= 0; j--) {
      var branch = this.branches[j];
      let closestBranch = null;
      let chosenLeaf = null
      var record = max_dist;
      for (var i = 0; i < this.leaves.length; i++) {
        var leaf = this.leaves[i];
        var d = p5.Vector.dist(leaf.pos, branch.pos);
        // if (d < min_dist) {
        //   leaf.reached = true;
        //   closestBranch = null;
        //   break;
        // } else if (d < record) {
        //   closestBranch = branch;
        //   record = d;
        // }

        if (d < record) {
          closestBranch = branch;
          chosenLeaf = i
          record = d;
        }
      }

      // if (closestBranch != null) {
      //   var newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
      //   leaf.reached = true
      //   newDir.normalize();
      //   closestBranch.dir.add(newDir);
      //   // closestBranch.count++;
      // }

      if (closestBranch != null) {
        // this.leaves[chosenLeaf].reached = true
        // var branch = this.branches[this.branches.length - 1];
        // if (branch.count > 0) {
        // branch.dir.div(branch.count + 1);
        this.branches.push(branch.next(this.leaves[chosenLeaf]));
        if (random(1) > 0.5) this.leaves.splice(chosenLeaf, 1);
        // }
      } else {
        // console.log(j)
      }
      // for (var i = this.leaves.length - 1; i >= 0; i--) {
      //   if (this.leaves[i].reached) {
      //     this.leaves.splice(i, 1);
      //   }
      // }
    }




    // for (var i = this.branches.length - 1; i >= 0; i--) {
    //   var branch = this.branches[i];
    //   if (branch.count > 0) {
    //     branch.dir.div(branch.count + 1);
    //     this.branches.push(branch.next());
    //     branch.reset();
    //   }
    // }
  };

  this.show = function () {
    noStroke();
    fill(..._clrs[1]);
    for (var i = 0; i < this.leaves.length; i++) {
      this.leaves[i].show();
    }

    stroke(..._clrs[1])
    noFill()
    for (var i = 0; i < this.branches.length; i++) {
      this.branches[i].show();
    }
  };
}