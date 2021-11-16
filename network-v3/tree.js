// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Tree(pos) {
  this.branches = [];
  this.specialBranches = []
  this.empty = false

  var pos = pos ? pos : createVector(width / 2, height / 2);
  var root = new Branch(null, pos);

  this.color = floor(random(1, 4))
  this.branches.push(root);
  this.transitioned = false
  this.transitionCount = 0

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

  this.removePath = function () {
    if (this.branches.length > 0) {
      for (let n = 0; n < 10; n++) {
        const branch = this.branches[this.branches.length - 1]
        // branch.pop()
        for (let i = 0; i < this.specialBranches.length; i++) {
          for (let j = 0; j < this.specialBranches[i].length; j++) {
            if (this.specialBranches[i][j] == branch) {
              this.specialBranches[i].splice(j, 1)
              break
            }
          }
        }
        this.branches.pop()
      }
    } else {
      this.empty = true
    }
  }

  this.grow = function () {
    this.finished = true
    for (var j = this.branches.length - 1; j >= 0; j--) {
      const branch = this.branches[j];
      let closestBranch = null;

      if (branch.isGrowing) {
        this.finished = false
      } else {
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
            const nextBranch = branch.next(chosenLeaf)
            this.branches.push(nextBranch);
            nextBranch.isGrowing = true
            chosenLeaf.reached = true
            this.finished = false
          } else {
            branch.full = true
          }
        }
      }
    }
  }

  this.show = function (p) {
    if (p) {
      p.strokeWeight(1)
      for (var i = 0; i < this.branches.length; i++) {
        const branch = this.branches[i]
        if (!branch.inSpecial) branch.show(p);
      }

      for (let n = 0; n < this.specialBranches.length; n++) {
        const col = this.branchesColors[n]
        const bri = map(n, 0, this.specialBranches[n].length - 1, 125, 255)
        if (params.highlight) p.strokeWeight(this.branchesWeight[n] ? 2 : 1)
        if (params.colorMode == 0 && params.colorMode != 3) p.stroke(_clrs[col])
        if (params.colorMode == 1 && params.colorMode != 3) p.stroke(..._clrs[this.color], bri)
        const currBranch = this.specialBranches[n]
        for (var i = 0; i < currBranch.length; i++) {
          const branch = currBranch[i]
          branch.show(p);
        }
      }
    } else {
      let percent = 0
      if (!this.transitioned) {
        if (this.finished) {
          this.transitionCount++
          if (this.transitionCount % (params.growingTime * 2) == 0) {
            this.transitioned = true
          }
          percent = 1 - this.transitionCount / (params.growingTime * 2)
        } else percent = 1
      }

      strokeWeight(1)
      for (var i = 0; i < this.branches.length; i++) {
        const branch = this.branches[i]
        if (!branch.inSpecial) branch.show();
      }

      for (let n = 0; n < this.specialBranches.length; n++) {
        const col = this.branchesColors[n]
        const bri = map(n, 0, this.specialBranches[n].length - 1, 125, 255)
        if (params.highlight) strokeWeight(this.branchesWeight[n] ? 2 - percent : 1)
        if (params.colorMode == 0 && params.colorMode != 3) stroke(_clrs[col])
        if (params.colorMode == 1 && params.colorMode != 3) stroke(..._clrs[this.color], bri)
        const currBranch = this.specialBranches[n]
        for (var i = 0; i < currBranch.length; i++) {
          const branch = currBranch[i]
          branch.show();
        }
      }
    }
  };
}